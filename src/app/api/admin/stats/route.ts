import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import BlogPost from '@/lib/models/BlogPost';
import WorkoutPlan from '@/lib/models/WorkoutPlan';
import DietPlan from '@/lib/models/DietPlan';
import ProgressLog from '@/lib/models/ProgressLog';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersToday,
      activeToday,
      premiumUsers,
      totalBlogs,
      publishedBlogs,
      totalWorkoutPlans,
      totalDietPlans,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ lastActive: { $gte: todayStart } }),
      User.countDocuments({ tier: { $in: ['premium', 'pro'] } }),
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      WorkoutPlan.countDocuments(),
      DietPlan.countDocuments(),
    ]);

    // User growth last 7 days
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0
    const growthMap: Record<string, number> = {};
    userGrowth.forEach((d: any) => { growthMap[d._id] = d.count; });
    const growthData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      growthData.push({ date: key, count: growthMap[key] || 0 });
    }

    // Recent registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email tier streak createdAt');

    // Blog views by category
    const blogByCategory = await BlogPost.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, views: { $sum: '$views' } } },
      { $sort: { views: -1 } },
    ]);

    return NextResponse.json({
      kpis: {
        totalUsers,
        newUsersToday,
        activeToday,
        premiumUsers,
        totalBlogs,
        publishedBlogs,
        totalWorkoutPlans,
        totalDietPlans,
        // Estimated revenue (₹499/mo per premium)
        monthlyRevenue: premiumUsers * 499,
        adRevenue: Math.round(publishedBlogs * 2.4 * 30),
      },
      charts: {
        userGrowth: growthData,
        blogByCategory,
      },
      recentUsers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
