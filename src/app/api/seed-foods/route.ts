import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FoodItem from '@/lib/models/FoodItem';
import { foodDatabase } from '@/lib/foodDatabase';

export async function GET() {
  try {
    await dbConnect();
    
    let count = 0;
    
    for (const [key, data] of Object.entries(foodDatabase)) {
      // Check if exists
      const existing = await FoodItem.findOne({ name: { $regex: new RegExp(`^${key}$`, 'i') } });
      if (!existing) {
        // Build diet styles from alternative
        const dietStyles = ['Any'];
        if (data.alternative && data.alternative.toLowerCase() !== 'various') {
          dietStyles.push(data.alternative);
        }
        
        await FoodItem.create({
          name: key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), // title case
          emoji: data.icon || '🍽️',
          dietStyle: dietStyles,
          mealTypes: Array.isArray(data.category) ? data.category : [data.category],
          servingUnit: data.unit || '100g',
          calories: data.cals,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
          selectionCount: 0,
          isVerified: true
        });
        count++;
      }
    }

    return NextResponse.json({ message: `Successfully seeded ${count} food items.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
