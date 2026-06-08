import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/authUtils';

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.id).select('pushNotificationsEnabled emailRemindersEnabled reminderTime streakAlertsEnabled');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ preferences: user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = await req.json();
    await dbConnect();

    const allowedUpdates: any = {};
    if (typeof updates.pushNotificationsEnabled === 'boolean') allowedUpdates.pushNotificationsEnabled = updates.pushNotificationsEnabled;
    if (typeof updates.emailRemindersEnabled === 'boolean') allowedUpdates.emailRemindersEnabled = updates.emailRemindersEnabled;
    if (typeof updates.streakAlertsEnabled === 'boolean') allowedUpdates.streakAlertsEnabled = updates.streakAlertsEnabled;
    if (typeof updates.reminderTime === 'string') allowedUpdates.reminderTime = updates.reminderTime;

    const user = await User.findByIdAndUpdate(session.id, { $set: allowedUpdates }, { new: true })
      .select('pushNotificationsEnabled emailRemindersEnabled reminderTime streakAlertsEnabled');

    return NextResponse.json({ preferences: user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
