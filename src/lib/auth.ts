import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('leanverse_token')?.value;

  if (!token) return false;
  if (!process.env.JWT_SECRET) return false;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
