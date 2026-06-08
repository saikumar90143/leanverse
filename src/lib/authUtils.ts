import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('leanverse_token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as { id: string; role: string; [key: string]: any };
  } catch (err) {
    return null;
  }
}
