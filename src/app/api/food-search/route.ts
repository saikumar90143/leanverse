import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalQuery } from '@/lib/foodDatabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const matches = parseNaturalQuery(query);

    if (matches.length === 0) {
      return NextResponse.json(
        { error: 'No matching foods found. Try simpler terms like "chicken", "rice", or "shawarma".' },
        { status: 404 }
      );
    }

    // Sum up macros from all matched foods, scaled by qty
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    const detectedItems: string[] = [];

    for (const { key, entry, qty } of matches) {
      totalCalories += entry.cals * qty;
      totalProtein  += entry.protein * qty;
      totalCarbs    += entry.carbs * qty;
      totalFats     += entry.fat * qty;
      detectedItems.push(`${entry.icon} ${qty > 1 ? `${qty}x ` : ''}${key} (${entry.baseQty} ${entry.unit})`);
    }

    return NextResponse.json({
      query,
      calories: Math.round(totalCalories),
      protein:  Math.round(totalProtein),
      carbs:    Math.round(totalCarbs),
      fats:     Math.round(totalFats),
      fiber:    0,
      ingredients: detectedItems,
    });

  } catch (error) {
    console.error('Food Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
