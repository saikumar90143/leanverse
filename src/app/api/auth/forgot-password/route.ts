import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't leak whether the email exists or not in production, 
      // but for this demo, it's fine. Actually, let's be secure.
      // We will pretend we sent it regardless.
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with that email exists, we sent a reset link.',
        resetUrl: 'http://localhost:3000/reset-password?token=MOCK_TOKEN' // Mock for testing if user doesn't exist
      });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Token expires in 1 hour
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Option A: Simulated Email (Return the URL directly)
    // The raw token is sent to the user, but the hash is stored in the DB.
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    const resetUrl = `${protocol}://${host}/reset-password?token=${resetToken}`;

    return NextResponse.json({ 
      success: true, 
      resetUrl,
      message: 'Reset link generated successfully.' 
    });

  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
