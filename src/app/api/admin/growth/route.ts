import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate MAU (Monthly Active Users - users who logged in this month)
    const mau = await User.countDocuments({ lastLogin: { $gte: firstDayOfMonth } });
    
    // Calculate DAU (Daily Active Users - users who logged in today)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dau = await User.countDocuments({ lastLogin: { $gte: today } });

    // Aggregate User Growth over the last 30 days
    const growthAggregation = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing days with 0
    const growth = [];
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const found = growthAggregation.find(g => g._id === dateStr);
      growth.push({
        date: dateStr,
        newUsers: found ? found.count : 0
      });
    }

    return NextResponse.json({
      dau,
      mau,
      growth,
      totalUsers: await User.countDocuments()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch growth metrics' }, { status: 500 });
  }
}
