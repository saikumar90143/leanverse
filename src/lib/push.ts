import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:support@leanverse.in',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function sendPushNotification(subscription: any, payload: any) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (err: any) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      // The subscription is expired or invalid
      return { success: false, expired: true };
    }
    return { success: false, error: err.message };
  }
}
