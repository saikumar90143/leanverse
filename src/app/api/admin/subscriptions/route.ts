import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SubscriptionPlan from '@/lib/models/SubscriptionPlan';

export async function GET() {
  try {
    await connectDB();
    const plans = await SubscriptionPlan.find().sort({ monthlyPrice: 1 });
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscription plans' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const plan = await SubscriptionPlan.create(data);
    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create subscription plan' }, { status: 500 });
  }
}
