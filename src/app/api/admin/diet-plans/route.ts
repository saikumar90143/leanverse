import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DietPlanTemplate from '@/lib/models/DietPlanTemplate';

export async function GET(req: Request) {
  try {
    await dbConnect();
    // Populate the foodItem references to get the food data
    const plans = await DietPlanTemplate.find({ isActive: true })
      .populate('meals.foods.foodItem')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ plans });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Simple macro calculation logic could be done on the frontend or here
    
    const plan = await DietPlanTemplate.create(body);
    // Populate before returning so the UI has full data immediately
    const populatedPlan = await DietPlanTemplate.findById(plan._id).populate('meals.foods.foodItem');
    return NextResponse.json({ plan: populatedPlan }, { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/admin/diet-plans:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, ...update } = await req.json();
    
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const plan = await DietPlanTemplate.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate('meals.foods.foodItem');
    return NextResponse.json({ plan });
  } catch (err: any) {
    console.error('Error in PATCH /api/admin/diet-plans:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await DietPlanTemplate.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
