import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FoodItem from '@/lib/models/FoodItem';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const foods = await FoodItem.find().sort({ selectionCount: -1 }).limit(100);
    return NextResponse.json({ foods });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch food items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const food = await FoodItem.create(data);
    return NextResponse.json({ food });
  } catch (error) {
    console.error('Failed to create food item:', error);
    return NextResponse.json({ error: 'Failed to create food item' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    if (!data._id) {
      return NextResponse.json({ error: 'Missing food item ID' }, { status: 400 });
    }
    
    const { _id, ...updateData } = data;
    const food = await FoodItem.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
    
    if (!food) {
      return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ food });
  } catch (error) {
    console.error('Failed to update food item:', error);
    return NextResponse.json({ error: 'Failed to update food item' }, { status: 500 });
  }
}
