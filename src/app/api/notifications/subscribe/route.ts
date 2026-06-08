import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PushSubscription from '@/lib/models/PushSubscription';
import User from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/authUtils';

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const subscription = await req.json();
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    await dbConnect();

    // Upsert subscription based on endpoint
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        userId: session.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      { upsert: true, new: true }
    );

    // Also update user's preference to true
    await User.findByIdAndUpdate(session.id, { pushNotificationsEnabled: true });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { endpoint } = await req.json();
    if (!endpoint) return NextResponse.json({ error: 'Endpoint required' }, { status: 400 });

    await dbConnect();
    await PushSubscription.findOneAndDelete({ endpoint, userId: session.id });

    // Note: We don't necessarily turn off the user's preference here because they might have other devices.
    // The preference is a global opt-in/opt-out flag controlled via the PUT /preferences route.

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
