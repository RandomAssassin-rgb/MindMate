import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Setup web-push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'dummy_private_key_for_build'; // This needs to be set in Prod!

webpush.setVapidDetails(
  'mailto:support@mindmate.app',
  vapidPublicKey,
  vapidPrivateKey
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  // Protect this cron route: Ensure it is called by Vercel Cron or a securely authorized client
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get all active subscriptions
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('user_id, push_subscription, reminder_time')
      .not('push_subscription', 'is', null);

    if (settingsError || !settings) {
      throw new Error(`Failed to fetch settings: ${settingsError?.message}`);
    }

    // 2. Determine who hasn't logged a mood today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notificationPromises = settings.map(async (setting) => {
      // Check if user logged mood today
      const { data: moodLogs } = await supabase
        .from('mood_logs')
        .select('id')
        .eq('user_id', setting.user_id)
        .gte('created_at', today.toISOString())
        .limit(1);

      // If they haven't logged today
      if (!moodLogs || moodLogs.length === 0) {
        
        // Ensure their 'reminder_time' is roughly now (hour matches)
        // For simplicity in this demo, we can just send it, or implement strict timezone logic.
        const currentHour = new Date().getHours();
        const reminderHour = parseInt(setting.reminder_time.split(':')[0], 10);
        
        // Send if it's their expected time block, or if we ignore time matching for the MVP.
        if (currentHour === reminderHour || process.env.NODE_ENV === 'development') {
          const payload = JSON.stringify({
            title: 'Time for a MindMate Check-in! 💙',
            body: 'Take a brief moment to log how you feel today.',
            url: '/mood'
          });

          try {
            await webpush.sendNotification(setting.push_subscription, payload);
          } catch (err: any) {
            console.error('Error sending push:', err);
            if (err.statusCode === 404 || err.statusCode === 410) {
              // Subscription expired or unsubscribed, clear it
              await supabase
                .from('notification_settings')
                .update({ push_subscription: null })
                .eq('user_id', setting.user_id);
            }
          }
        }
      }
    });

    await Promise.allSettled(notificationPromises);

    return NextResponse.json({ success: true, processed: settings.length });

  } catch (err: any) {
    console.error('Cron job error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
