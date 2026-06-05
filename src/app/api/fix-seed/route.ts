import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FoodItem from '@/lib/models/FoodItem';

function titleCaseMealType(m: string) {
  const lower = m.toLowerCase();
  if (lower === 'pre-workout' || lower === 'pre workout') return 'Pre-Workout';
  if (lower === 'post-workout' || lower === 'post workout') return 'Post-Workout';
  if (lower === 'snack') return 'Snack';
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export async function GET() {
  try {
    await dbConnect();
    
    const foods = await FoodItem.find();
    let updatedCount = 0;
    
    for (const food of foods) {
      // Fix mealTypes casing
      let updated = false;
      
      if (food.mealTypes && food.mealTypes.length > 0) {
        const fixedMealTypes = food.mealTypes.map((m: string) => titleCaseMealType(m));
        // Check if different
        if (JSON.stringify(food.mealTypes) !== JSON.stringify(fixedMealTypes)) {
          food.mealTypes = fixedMealTypes;
          updated = true;
        }
      }
      
      // Fix dietStyle. If it was seeded as ['Omnivore'] or ['Any'] which doesn't exist in the admin UI
      if (food.dietStyle) {
        const oldDietStyles = food.dietStyle.join(',');
        
        let newDietStyles = new Set<string>();
        
        // If it was just seeded and doesn't match the new arrays well, let's give it basic ones
        if (food.dietStyle.includes('Any') || food.dietStyle.includes('Omnivore')) {
          newDietStyles.add('Non-Vegetarian');
          newDietStyles.add('Vegetarian');
          newDietStyles.add('Eggetarian');
        }
        
        // Retain any existing valid ones
        const validAdminStyles = ["Non-Vegetarian", "Vegetarian", "Eggetarian", "Vegan", "South Indian", "North Indian", "High Protein", "Keto"];
        for (const ds of food.dietStyle) {
          const dsTitle = ds.split(' ').map((w:string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          if (validAdminStyles.includes(dsTitle)) {
             newDietStyles.add(dsTitle);
          }
          if (ds.toLowerCase() === 'vegan') newDietStyles.add('Vegan');
          if (ds.toLowerCase() === 'keto') newDietStyles.add('Keto');
          if (ds.toLowerCase() === 'high protein') newDietStyles.add('High Protein');
        }
        
        // Default to Vegetarian if none matched
        if (newDietStyles.size === 0) newDietStyles.add('Vegetarian');
        
        const newArr = Array.from(newDietStyles);
        if (JSON.stringify(food.dietStyle) !== JSON.stringify(newArr)) {
          food.dietStyle = newArr;
          updated = true;
        }
      }
      
      if (updated) {
        await food.save();
        updatedCount++;
      }
    }

    return NextResponse.json({ message: `Successfully normalized format for ${updatedCount} food items.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
