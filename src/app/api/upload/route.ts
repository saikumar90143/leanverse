import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // SECURITY: Limit file size to 15MB for mobile camera compatibility
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 15MB limit' }, { status: 413 });
    }

    // SECURITY: Only allow image MIME types
    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Only images are allowed' }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a predictable hash based on the file contents to prevent duplicates
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
    const publicId = `img_${fileHash}`;

    // Stream the buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'leanverse_uploads',
          public_id: publicId,
          overwrite: true
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const url = (uploadResult as any).secure_url;

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}

