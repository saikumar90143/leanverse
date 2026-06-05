import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WorkoutProgram from '@/lib/models/WorkoutProgram';

export async function GET() {
  try {
    await connectDB();
    const programs = await WorkoutProgram.find().sort({ createdAt: -1 });
    return NextResponse.json({ programs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const program = await WorkoutProgram.create(data);
    return NextResponse.json({ program });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workout program' }, { status: 500 });
  }
}
