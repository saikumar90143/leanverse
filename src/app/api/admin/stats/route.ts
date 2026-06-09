import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import BlogPost from '@/lib/models/BlogPost';
import WorkoutProgram from '@/lib/models/WorkoutProgram';
import DietPlanTemplate from '@/lib/models/DietPlanTemplate';
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
      WorkoutProgram.countDocuments(),
      DietPlanTemplate.countDocuments(),
    ]);

    // Helper function to aggregate growth
    const getGrowthData = async (Model: any) => {
      const growth = await Model.aggregate([
        { $match: { createdAt: { $gte: last7Days } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
      ]);
      const map: Record<string, number> = {};
      growth.forEach((d: any) => { map[d._id] = d.count; });
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split('T')[0];
        data.push({ date: key, count: map[key] || 0 });
      }
      return data;
    };

    const growthData = await getGrowthData(User);
    const workoutGrowthData = await getGrowthData(WorkoutProgram);
    const dietGrowthData = await getGrowthData(DietPlanTemplate);

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
        workoutGrowth: workoutGrowthData,
        dietGrowth: dietGrowthData,
        blogByCategory,
      },
      recentUsers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
