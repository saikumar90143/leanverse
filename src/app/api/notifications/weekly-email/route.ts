import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import BlogPost from '@/lib/models/BlogPost';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get users opted into email reminders
    const users = await User.find({ emailRemindersEnabled: true }).select('email name');

    if (users.length === 0) {
      return NextResponse.json({ success: true, message: 'No opted-in users found' });
    }

    // Get the latest 3 published blogs
    const recentBlogs = await BlogPost.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .lean();

    let blogsHtml = '';
    if (recentBlogs.length > 0) {
      blogsHtml = `
        <h2 style="color:#059669;margin-top:20px;">Top Articles This Week</h2>
        <ul style="list-style:none;padding:0;">
          ${recentBlogs.map((blog: any) => `
            <li style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #eee;">
              <h3 style="margin:0 0 5px 0;">
                <a href="https://leanverse.in/blog/${blog.slug}" style="color:#111;text-decoration:none;">${blog.title}</a>
              </h3>
              <p style="margin:0;color:#666;font-size:14px;">${blog.summary}</p>
            </li>
          `).join('')}
        </ul>
      `;
    }

    let sentCount = 0;

    for (const user of users) {
      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;line-height:1.6;">
          <h1 style="text-align:center;color:#111;">Weekly LeanVerse Digest</h1>
          <p>Hi ${user.name},</p>
          <p>Another week to get 1% better. Did you hit your macro goals and crush your workouts this week?</p>
          
          <div style="text-align:center;margin:30px 0;">
            <a href="https://leanverse.in/dashboard" style="background-color:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">View My Progress</a>
          </div>

          ${blogsHtml}

          <hr style="border:none;border-top:1px solid #ddd;margin:30px 0;" />
          <p style="font-size:12px;color:#999;text-align:center;">
            You are receiving this email because you opted into LeanVerse weekly reminders.<br/>
            To unsubscribe, visit your <a href="https://leanverse.in/settings/notifications" style="color:#059669;">Notification Settings</a>.
          </p>
        </div>
      `;

      const result = await sendEmail({
        to: user.email,
        subject: 'Your Weekly LeanVerse Progress & Top Articles',
        html,
      });

      if (result.success) sentCount++;
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
