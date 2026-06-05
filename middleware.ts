import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  // We only want to protect /api/admin routes for now
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Allow public GET access to foods, diet-plans, and affiliates
    if (request.method === 'GET' && (
      request.nextUrl.pathname.startsWith('/api/admin/foods') ||
      request.nextUrl.pathname.startsWith('/api/admin/diet-plans') ||
      request.nextUrl.pathname.startsWith('/api/admin/affiliates')
    )) {
      return NextResponse.next();
    }

    const token = request.cookies.get('leanverse_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, encodedSecret);
      
      // Ensure only admins can access /api/admin
      if (payload.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      }

      // Token is valid and user is admin, allow request
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
