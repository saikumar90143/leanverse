import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import PushSubscription from '@/lib/models/PushSubscription';
import { sendPushNotification } from '@/lib/push';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Find users with streak > 0 and streakAlertsEnabled = true
    const users = await User.find({ streakAlertsEnabled: true, streak: { $gt: 0 } });
    
    let sentCount = 0;
    
    for (const user of users) {
      const lastActive = new Date(user.lastActive);
      const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      
      const diffTime = todayDate.getTime() - lastActiveDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // If they haven't logged today yet, their streak is at risk
      if (diffDays === 1) {
        const subscriptions = await PushSubscription.find({ userId: user._id });
        for (const sub of subscriptions) {
          const result = await sendPushNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            {
              title: "🔥 Streak at Risk!",
              body: `You're on a ${user.streak}-day streak! Don't let it break. Log your workout before midnight.`,
              data: { url: '/workout-planner' },
            }
          );
          if (result.success) sentCount++;
          else if (result.expired) await PushSubscription.findByIdAndDelete(sub._id);
        }
      }
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
