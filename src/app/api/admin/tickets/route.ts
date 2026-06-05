import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SupportTicket from '@/lib/models/SupportTicket';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = {};
    if (status) query.status = status;

    const [tickets, total] = await Promise.all([
      SupportTicket.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      SupportTicket.countDocuments(query),
    ]);

    return NextResponse.json({ tickets, total });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const ticket = await SupportTicket.create(body);
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, ...update } = await req.json();
    if (update.status === 'resolved') update.resolvedAt = new Date();
    const ticket = await SupportTicket.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ ticket });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
