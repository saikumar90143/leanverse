import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Affiliate from '@/lib/models/Affiliate';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = {};
    if (category) query.category = category;

    const [affiliates, total] = await Promise.all([
      Affiliate.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Affiliate.countDocuments(query),
    ]);

    return NextResponse.json({ affiliates, total });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const affiliate = await Affiliate.create(body);
    return NextResponse.json({ affiliate }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, ...update } = await req.json();
    const affiliate = await Affiliate.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ affiliate });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Affiliate.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
