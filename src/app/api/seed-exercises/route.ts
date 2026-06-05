import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exercise from '@/lib/models/Exercise';
import { exerciseDatabase } from '@/lib/exerciseDatabase';

export async function GET() {
  try {
    await dbConnect();
    
    // Check if exercises already exist
    const count = await Exercise.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: 'Database already seeded', count });
    }

    // Map the local static database to the MongoDB schema
    const exercisesToInsert = exerciseDatabase.map(ex => {
      // Create a URL-friendly slug
      const slug = ex.name.toLowerCase().replace(/[^a-z0-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      return {
        name: ex.name,
        slug: slug,
        muscleGroup: ex.muscleGroup,
        equipment: ex.equipment || 'None',
        difficulty: [ex.difficulty || 'Beginner'],
        category: 'Strength', // Default fallback
        instructions: ex.instructions, // Passed as array, matching new schema
        caloriesPerMinute: 6,
        imageUrl: ex.imageUrl || '',
        isActive: true,
        usageCount: 0,
        avgRating: 5,
        locationType: 'Both',
      };
    });

    // Bulk insert
    await Exercise.insertMany(exercisesToInsert);

    return NextResponse.json({ message: 'Successfully seeded exercises', count: exercisesToInsert.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
