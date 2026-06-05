import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = {};
    if (status) query.status = status;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];

    const [posts, total] = await Promise.all([
      BlogPost.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      BlogPost.countDocuments(query),
    ]);

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check for duplicate slug
    const existing = await BlogPost.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const post = await BlogPost.create({
      ...body,
      slug: finalSlug,
      publishedAt: body.status === 'published' ? new Date() : null,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, ...update } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    if (update.status === 'published' && !update.publishedAt) {
      update.publishedAt = new Date();
    }
    const post = await BlogPost.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
