import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exercise from '@/lib/models/Exercise';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const muscle = searchParams.get('muscle') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');

    const query: any = { isActive: true };
    if (muscle) query.muscleGroup = muscle;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.name = { $regex: search, $options: 'i' };

    const [exercises, total] = await Promise.all([
      Exercise.find(query).sort({ name: 1 }).skip((page - 1) * limit).limit(limit),
      Exercise.countDocuments(query),
    ]);

    return NextResponse.json({ exercises, total, page, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    if (typeof body.instructions === 'string') {
      body.instructions = body.instructions.split('\n').filter(Boolean);
    } else if (!Array.isArray(body.instructions)) {
      body.instructions = [];
    }

    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = await Exercise.findOne({ slug: body.slug });
      if (existing) {
        body.slug = `${body.slug}-${Math.floor(Math.random() * 10000)}`;
      }
    }

    const exercise = await Exercise.create(body);
    return NextResponse.json({ exercise }, { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/admin/exercises:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, ...update } = await req.json();
    
    if (typeof update.instructions === 'string') {
      update.instructions = update.instructions.split('\n').filter(Boolean);
    }

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const exercise = await Exercise.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    return NextResponse.json({ exercise });
  } catch (err: any) {
    console.error('Error in PATCH /api/admin/exercises:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Exercise.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
