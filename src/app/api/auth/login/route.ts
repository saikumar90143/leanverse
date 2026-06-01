import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Dynamic streak calculation:
    // If they were active yesterday, increment streak. If active today, keep streak. Else, reset/set streak to 1.
    const today = new Date();
    const lastActive = new Date(user.lastActive);
    
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
    };

    return NextResponse.json({ success: true, user: userSession });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
