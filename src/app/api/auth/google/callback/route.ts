import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  email: string;
  picture: string;
  email_verified: boolean;
}

export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${siteUrl}/login?error=google_auth_failed`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret || clientId === 'your-google-client-id-here') {
    return NextResponse.redirect(`${siteUrl}/login?error=google_not_configured`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${siteUrl}/login?error=token_exchange_failed`);
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    // Get user profile from Google
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(`${siteUrl}/login?error=userinfo_failed`);
    }

    const googleUser: GoogleUserInfo = await userInfoRes.json();

    if (!googleUser.email_verified) {
      return NextResponse.redirect(`${siteUrl}/login?error=email_not_verified`);
    }

    // Connect to MongoDB and upsert user
    await dbConnect();

    let user = await User.findOne({
      $or: [{ googleId: googleUser.sub }, { email: googleUser.email.toLowerCase() }],
    });

    if (user) {
      // Existing user — link Google account if needed
      if (!user.googleId) {
        user.googleId = googleUser.sub;
      }
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
      }
      // Update streak
      const today = new Date();
      const lastActive = new Date(user.lastActive);
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      
      const diffTime = todayDate.getTime() - lastActiveDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) user.streak = (user.streak || 0) + 1;
      else if (diffDays > 1) user.streak = 1;
      else if (!user.streak) user.streak = 1;
      user.lastActive = today;

      // Badge milestones
      if (user.streak >= 5 && !user.badges.includes('Consistent Logger'))
        user.badges.push('Consistent Logger');
      if (user.streak >= 10 && !user.badges.includes('Streak Champion'))
        user.badges.push('Streak Champion');

      await user.save();
    } else {
      // New user via Google
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email.toLowerCase(),
        googleId: googleUser.sub,
        avatar: googleUser.picture || null,
        passwordHash: null,
        role: 'user',
        tier: 'free',
        streak: 1,
        lastActive: new Date(),
        badges: ['New Joiner', 'Google Pioneer'],
      });
    }

    const sessionPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      tier: user.tier,
      streak: user.streak,
      badges: user.badges,
      avatar: user.avatar || null,
    };

    // Encode session and redirect to client-side success handler
    const encoded = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
    return NextResponse.redirect(`${siteUrl}/auth/google/success?session=${encoded}`);
  } catch (err: unknown) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(`${siteUrl}/login?error=server_error`);
  }
}
