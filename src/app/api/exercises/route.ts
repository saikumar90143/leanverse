import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exercise from '@/lib/models/Exercise';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || null;

    // Fetch public exercises + user's own custom exercises
    const query: any = {
      isActive: true,
      $or: [
        { isCustom: { $ne: true } },                           // all public/global exercises
        ...(userId ? [{ isCustom: true, createdBy: userId }] : []), // user's own custom
      ],
    };

    const exercises = await Exercise.find(query).sort({ isCustom: 1, name: 1 });
    return NextResponse.json({ exercises });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, name, muscleGroup, equipment, category, difficulty, description } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    if (!name || !muscleGroup) {
      return NextResponse.json({ error: 'Name and muscle group are required' }, { status: 400 });
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${userId.slice(-6)}-${Date.now()}`;

    const exercise = await Exercise.create({
      name,
      slug,
      muscleGroup,
      equipment: equipment || 'Bodyweight',
      equipmentRequired: equipment ? [equipment] : ['bodyweight'],
      category: category || 'Strength',
      difficulty: Array.isArray(difficulty) ? difficulty : ['Beginner', 'Intermediate', 'Advanced'],
      description: description || '',
      isCustom: true,
      createdBy: userId,
      isActive: true,
      recommendedSets: { min: 3, max: 4 },
      recommendedReps: { min: 8, max: 12 },
      recommendedRestSeconds: 60,
      caloriesPerMinute: 5,
    });

    return NextResponse.json({ exercise }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json({ error: 'id and userId required' }, { status: 400 });
    }

    const exercise = await Exercise.findOne({ _id: id, createdBy: userId, isCustom: true });
    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found or not authorized' }, { status: 404 });
    }

    await Exercise.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
