import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

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
      avatar: newUser.avatar
    };

    const token = jwt.sign(
      { id: newUser._id.toString(), role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret_please_change_in_production',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ success: true, user: userSession }, { status: 201 });
    
    // Set secure HttpOnly cookie
    response.cookies.set({
      name: 'leanverse_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.VERCEL === '1',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
