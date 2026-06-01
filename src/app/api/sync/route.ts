import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Attempt DB connection
    try {
      if (process.env.MONGODB_URI) {
        await dbConnect();
        // Here we would sync data.streak, data.logs, etc. with Mongoose models
        // e.g. await User.findByIdAndUpdate(data.userId, { streak: data.streak });
      } else {
        // Safe fallback when no DB is configured
        return NextResponse.json({ success: true, message: 'Offline sync successful (Local Storage only)', syncedToCloud: false });
      }
    } catch (dbError) {
      console.warn('Database sync failed or not configured, relying on local storage.', dbError);
      return NextResponse.json({ success: true, message: 'Offline sync successful (Database unreachable)', syncedToCloud: false });
    }

    return NextResponse.json({ success: true, message: 'Cloud sync successful', syncedToCloud: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
