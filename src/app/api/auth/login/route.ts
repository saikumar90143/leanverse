import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Sandbox fallback for Admin Demo
    if (!user && email === 'admin@leanverse.com' && password === 'admin123') {
      const userSession = {
        id: 'admin_mock',
        name: 'LeanVerse Administrator',
        email: 'admin@leanverse.com',
        role: 'admin',
        tier: 'pro',
        streak: 15,
        badges: ['Elite Creator', 'AdSense Guru', 'Streak Champion'],
        avatar: undefined
      };

      if (!process.env.JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET environment variable is missing.');
      }

      const token = jwt.sign(
        { id: 'admin_mock', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({ success: true, user: userSession });
      
      response.cookies.set({
        name: 'leanverse_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' && process.env.VERCEL === '1', // Only require HTTPS on actual Vercel prod
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

    // Artificial delay to mitigate brute-force attacks
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Dynamic streak calculation:
    // If they were active yesterday, increment streak. If active today, keep streak. Else, reset/set streak to 1.
    const today = new Date();
    const lastActive = new Date(user.lastActive);
    
    // Normalize to midnight to calculate true calendar day difference
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    
    const diffTime = todayDate.getTime() - lastActiveDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let nextStreak = user.streak || 0;
    if (diffDays === 1) {
      nextStreak += 1;
    } else if (diffDays > 1) {
      nextStreak = 1;
    } else if (nextStreak === 0) {
      nextStreak = 1;
    }

    user.streak = nextStreak;
    user.lastActive = today;
    
    // Grant badge on milestones
    const nextBadges = [...user.badges];
    if (nextStreak >= 5 && !nextBadges.includes('Consistent Logger')) {
      nextBadges.push('Consistent Logger');
    }
    if (nextStreak >= 10 && !nextBadges.includes('Streak Champion')) {
      nextBadges.push('Streak Champion');
    }
    user.badges = nextBadges;

    await user.save();

    const userSession = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      tier: user.tier,
      streak: user.streak,
      badges: user.badges,
      avatar: user.avatar
    };

    if (!process.env.JWT_SECRET) {
      throw new Error('FATAL: JWT_SECRET environment variable is missing.');
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ success: true, user: userSession });
    
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
