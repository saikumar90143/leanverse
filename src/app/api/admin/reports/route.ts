import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import WorkoutProgram from '@/lib/models/WorkoutProgram';
import FoodItem from '@/lib/models/FoodItem';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'users';
    
    let headers: string[] = [];
    let rows: string[][] = [];

    if (type === 'users') {
      const users = await User.find().sort({ createdAt: -1 }).limit(100);
      headers = ['Name', 'Email', 'Tier', 'Streak', 'Joined'];
      rows = users.map(u => [
        u.name || 'Unknown',
        u.email || '',
        u.subscriptionTier || 'free',
        (u.streak || 0).toString(),
        new Date(u.createdAt).toISOString().split('T')[0]
      ]);
    } else if (type === 'workouts') {
      const workouts = await WorkoutProgram.find().sort({ activeUsers: -1 });
      headers = ['Program', 'Level', 'Goal', 'Duration', 'Active Users', 'Completion %'];
      rows = workouts.map(w => [
        w.name,
        w.level,
        w.goal,
        w.durationDays.toString(),
        w.activeUsers.toString(),
        w.completionRate.toString()
      ]);
    } else if (type === 'diet') {
      const foods = await FoodItem.find().sort({ selectionCount: -1 }).limit(50);
      headers = ['Food', 'Category', 'Cals', 'Protein(g)', 'Carbs(g)', 'Fat(g)', 'Selections'];
      rows = foods.map(f => [
        f.name,
        f.category,
        f.calories.toString(),
        f.protein.toString(),
        f.carbs.toString(),
        f.fat.toString(),
        f.selectionCount.toString()
      ]);
    } else {
      // Default fallback mock data for unconfigured types
      headers = ['Data', 'Status'];
      rows = [['Report Not Found', 'Error']];
    }

    return NextResponse.json({
      reportType: type,
      headers,
      rows
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
