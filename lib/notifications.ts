import webpush from 'web-push';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:support@cs2bd.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function sendWebPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; url?: string }
) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.log('[Mock WebPush] Subscription:', subscription.endpoint, '| Payload:', payload);
    return { success: true, mocked: true };
  }

  try {
    await webpush.sendNotification(
      subscription as any,
      JSON.stringify(payload)
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending web push notification:', error);
    return { success: false, error };
  }
}
