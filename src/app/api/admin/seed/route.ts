import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import BlogPost from '@/lib/models/BlogPost';
import Product from '@/lib/models/Product';

export async function GET() {
  try {
    await dbConnect();

    // 1. Seed Users (clear and reload)
    await User.deleteMany({});
    
    // We store plain text or simple hashes for mock auth
    const adminUser = await User.create({
      name: 'LeanVerse Admin Team',
      email: 'admin@leanverse.com',
      passwordHash: 'admin123',
      role: 'admin',
      tier: 'pro',
      streak: 15,
      badges: ['Elite Creator', 'AdSense Guru', 'Streak Champion'],
    });

    const standardUser = await User.create({
      name: 'Rohan Sharma',
      email: 'user@leanverse.com',
      passwordHash: 'user123',
      role: 'user',
      tier: 'premium',
      streak: 5,
      badges: ['Consistent Logger', 'Healthy Eater'],
    });

    // 2. Seed Products/Store
    await Product.deleteMany({});
    const sampleProducts = [
      {
        name: 'Optimum Nutrition Gold Standard Whey',
        category: 'Supplements',
        description: 'The world\'s best-selling whey protein powder. Delivering 24g of high-quality premium whey isolates to build muscle and support recovery.',
        price: 59.99,
        rating: 4.8,
        affiliateLink: 'https://amazon.com',
        imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&q=80',
        tags: ['Best for Beginners', 'High Protein', 'Muscle Recovery'],
      },
      {
        name: 'Creapure Micronized Creatine Monohydrate',
        category: 'Supplements',
        description: '100% pure Creapure premium micronized creatine monohydrate. Increases athletic power, explosive force, and cellular muscular endurance.',
        price: 24.99,
        rating: 4.9,
        affiliateLink: 'https://amazon.com',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
        tags: ['High Quality', 'Strength Builder'],
      },
      {
        name: 'ActiveFit Smart Watch Pro v5',
        category: 'Smartwatches',
        description: 'Advanced dynamic biometric sensor tracking. Real-time heart rate, calorie burn calculations, sleep mapping, and integrated training assistant.',
        price: 189.00,
        rating: 4.6,
        affiliateLink: 'https://amazon.com',
        imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80',
        tags: ['Smart Tracker', 'Heart Monitor'],
      },
      {
        name: 'LeanVerse Smart Bluetooth Body Fat Scale',
        category: 'Accessories',
        description: 'Syncs with your phone to instantly calculate BMI, body fat %, muscle mass, hydration index, bone density, and visceral fat percentages.',
        price: 34.99,
        rating: 4.7,
        affiliateLink: 'https://amazon.com',
        imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80',
        tags: ['Best Seller', 'Weight Tracker'],
      },
      {
        name: 'Heavy Duty Latex Resistance Bands Set',
        category: 'Accessories',
        description: 'Complete workout kit featuring 5 color-coded resistance tubes, foam handles, ankle straps, and standard door anchors. Ideal for home workouts.',
        price: 19.99,
        rating: 4.5,
        affiliateLink: 'https://amazon.com',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
        tags: ['Home Gym', 'Portability'],
      },
    ];
    await Product.insertMany(sampleProducts);

    // 3. Seed Blog Posts
    await BlogPost.deleteMany({});
    const sampleBlogs = [
      {
        title: 'The Ultimate Guide to Indian Diet Plans for Fat Loss',
        slug: 'ultimate-indian-diet-plan-fat-loss',
        summary: 'Struggling to hit your protein targets on a traditional Indian diet? Discover how to combine paneer, dal, chicken, and brown rice to shred fat sustainably.',
        content: '<h2>Introduction to Healthy Fat Loss</h2><p>Losing body fat requires a persistent but moderate calorie deficit. On a typical South or North Indian diet, carbs can dominate our macro percentages. However, with deliberate tweaks, you can hit elite protein targets without exceeding your calorie limit.</p><h3>Key Macro Changes</h3><ol><li><strong>Dosa & Idli swaps:</strong> Standard rice idlis can be swapped for Oats Idli or Ragi Dosa to increase dietary fiber.</li><li><strong>Protein upgrades:</strong> Add paneer or boiled egg whites to your breakfast routines to improve satiety.</li><li><strong>Include Dals:</strong> While lentils provide fiber, combine them with standard whey isolate or lean meats to complete your amino acid profiles.</li></ol><h3>Example Macro Distribution</h3><p>Ensure that at least 30% of your daily calories come from protein. Tracking weight shifts consistently will guide whether your TDEE deficit is balanced.</p>',
        author: 'Dietitian Priya Patel',
        category: 'Indian diet plans',
        tags: ['Weight loss', 'Indian diet plans', 'High protein'],
        coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
      },
      {
        title: 'Gym Workouts: Designing a Perfect Push/Pull/Legs Split',
        slug: 'gym-workouts-perfect-push-pull-legs-split',
        summary: 'PPL is one of the most effective weekly training programs. Learn how to sequence movements to optimize muscle recovery and progressive overload.',
        content: '<h2>What is a PPL Split?</h2><p>The Push/Pull/Legs training method splits your body by movement type. This ensures that muscle groups have ample rest (48-72 hours) while maximizing mechanical stress and hypertrophy.</p><h3>The Weekly Breakdown</h3><ul><li><strong>Push Day:</strong> Target Chest, Shoulders, and Triceps (e.g. Bench Press, Overhead Press, Cable Pressdowns).</li><li><strong>Pull Day:</strong> Target Back, Rear Delts, and Biceps (e.g. Lat Pulldowns, Barbell Rows, Hammer Curls).</li><li><strong>Legs Day:</strong> Target Quads, Hamstrings, Glutes, and Calves (e.g. Barbell Squats, Romanian Deadlifts, Calf Raises).</li></ul><h3>Applying Progressive Overload</h3><p>To grow, you must systematically increase the volume over time. Log your weights on our user dashboard to monitor weekly performance curves.</p>',
        author: 'Coach Vikram Rathore',
        category: 'Gym workouts',
        tags: ['Gym workouts', 'Hypertrophy', 'Strength'],
        coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
      },
      {
        title: 'Home Workouts: How to Lose Fat with Minimal Equipment',
        slug: 'home-workouts-fat-loss-minimal-equipment',
        summary: 'No gym membership? No problem. Here is an intensive HIIT and bodyweight circuit designed to burn calories and build lean muscle in your living room.',
        content: '<h2>Effective Home Workouts</h2><p>Home training relies on high relative intensity, short rest intervals, and complex body movements. You can accomplish elite cardio benchmarks and muscular endurance using just resistance bands and bodyweight.</p><h3>High-Intensity Home Circuit</h3><p>Perform each movement for 40 seconds followed by 20 seconds of rest. Complete 4 total rounds:</p><ol><li>Bodyweight Tempo Squats</li><li>Standard Push-Ups (or Incline Push-Ups)</li><li>Banded Lat Pulldowns or Door Rows</li><li>Glute Bridges</li><li>Bicycle Crunches</li></ol><h3>Hydration Tips</h3><p>Drink at least 500ml of water during this circuit to sustain cardiovascular output. Use our water intake log on the user dashboard to track your daily goals.</p>',
        author: 'Trainer Sarah Jenkins',
        category: 'Home workouts',
        tags: ['Home workouts', 'HIIT', 'Fat loss'],
        coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
      },
    ];
    await BlogPost.insertMany(sampleBlogs);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with users, blog posts, and products.',
      seededCount: {
        users: 2,
        products: sampleProducts.length,
        blogs: sampleBlogs.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}
