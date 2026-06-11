import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('leanverse_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    let decoded: any;
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET environment variable is missing.');
      }
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    await dbConnect();

    // The user wants to upgrade to Pro for free for 1 year
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { 
        tier: 'pro',
        subscriptionExpiresAt: expirationDate
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Create a new token with the updated tier (if we stored tier in JWT, we don't, but let's refresh it anyway)
    if (!process.env.JWT_SECRET) {
      throw new Error('FATAL: JWT_SECRET environment variable is missing.');
    }

    const newToken = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier,
        streak: user.streak,
        badges: user.badges,
        avatar: user.avatar,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });

    response.cookies.set({
      name: 'leanverse_token',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.VERCEL === '1',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Upgrade Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
