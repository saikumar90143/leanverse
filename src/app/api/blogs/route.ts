import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Only fetch published blogs
    const posts = await BlogPost.find({ status: 'published' })
      .select('title slug summary category tags coverImage author publishedAt createdAt')
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    console.error('Error fetching blogs:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
