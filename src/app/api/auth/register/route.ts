import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Save user profile
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password, // For simplicity in our demo sandbox
      role: 'user',
      tier: 'free',
      streak: 1,
      lastActive: new Date(),
      badges: ['New Joiner'],
    });

    const userSession = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      tier: newUser.tier,
      streak: newUser.streak,
      badges: newUser.badges,
    };

    return NextResponse.json({ success: true, user: userSession });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
