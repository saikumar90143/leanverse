import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AdminSettings from '@/lib/models/AdminSettings';

async function getSettings() {
  let settings = await AdminSettings.findOne({ key: 'global' });
  if (!settings) {
    settings = await AdminSettings.create({ key: 'global' });
  }
  return settings;
}

export async function GET() {
  try {
    await dbConnect();
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const settings = await AdminSettings.findOneAndUpdate(
      { key: 'global' },
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
