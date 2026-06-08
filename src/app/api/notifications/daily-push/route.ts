import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import PushSubscription from '@/lib/models/PushSubscription';
import { sendPushNotification } from '@/lib/push';

export async function POST(req: NextRequest) {
  try {
    // Basic auth check for cron jobs
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get current time in HH:mm format (e.g., '08:00') based on server time, or target a specific hour
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    // For a real production app, you might match exactly, e.g. `${hours}:00`.
    // We'll just grab everyone who has push enabled.
    
    // In a more complex setup, you'd match user.reminderTime == current hour.
    // For simplicity, we'll just send to all users who have it enabled.

    const users = await User.find({ pushNotificationsEnabled: true }).select('_id name');
    const userIds = users.map(u => u._id);

    const subscriptions = await PushSubscription.find({ userId: { $in: userIds } });

    let sentCount = 0;
    let expiredCount = 0;

    for (const sub of subscriptions) {
      const payload = {
        title: "Time to crush your goals! 🚀",
        body: "Your daily LeanVerse workout is waiting. Log your progress now to keep your streak alive!",
        data: { url: '/workout-planner' },
      };

      const result = await sendPushNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        payload
      );

      if (result.success) {
        sentCount++;
      } else if (result.expired) {
        expiredCount++;
        await PushSubscription.findByIdAndDelete(sub._id);
      }
    }

    return NextResponse.json({ success: true, sent: sentCount, expired: expiredCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
