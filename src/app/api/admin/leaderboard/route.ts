import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    const topUsers = await User.find({ role: 'user' })
      .sort({ streak: -1, lastLogin: -1 })
      .limit(5);

    const leaderboard = topUsers.map((u, i) => ({
      rank: i + 1,
      name: u.name || 'Anonymous',
      streak: u.streak || 0,
      workouts: Math.floor((u.streak || 0) * 1.5) + Math.floor(Math.random() * 10), // Mock workouts calculation
      weightLost: ((u.streak || 0) * 0.2).toFixed(1), // Mock weight lost calculation based on streak
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
