import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import { getUserFromRequest } from '@/lib/authUtils';
import PersonalRecord from '@/lib/models/PersonalRecord';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const prs = await PersonalRecord.find({ userId: user.id }).lean();

    // Transform from array to the Record<string, PR> format the client expects
    const prsDict: Record<string, any> = {};
    for (const pr of prs) {
      prsDict[pr.exerciseId] = {
        maxWeight: pr.maxWeight,
        maxReps: pr.maxReps,
        maxRepsAtMaxWeight: pr.maxRepsAtMaxWeight,
        estimated1RM: pr.estimated1RM,
        lastPerformed: pr.lastPerformed,
      };
    }

    return NextResponse.json({ success: true, prs: prsDict });
  } catch (error: any) {
    console.error('Error fetching PRs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prs } = await req.json();
    if (!prs || typeof prs !== 'object') {
      return NextResponse.json({ error: 'Invalid PR data' }, { status: 400 });
    }

    await dbConnect();

    // Prepare bulk ops for upserting
    const bulkOps = [];
    for (const [exerciseId, pr] of Object.entries(prs)) {
      const prData: any = pr;
      bulkOps.push({
        updateOne: {
          filter: { userId: user.id, exerciseId },
          update: {
            $set: {
              maxWeight: prData.maxWeight || 0,
              maxReps: prData.maxReps || 0,
              maxRepsAtMaxWeight: prData.maxRepsAtMaxWeight || 0,
              estimated1RM: prData.estimated1RM || 0,
              lastPerformed: prData.lastPerformed ? new Date(prData.lastPerformed) : new Date(),
            },
          },
          upsert: true,
        },
      });
    }

    if (bulkOps.length > 0) {
      await PersonalRecord.bulkWrite(bulkOps);
    }

    return NextResponse.json({ success: true, message: 'PRs synchronized successfully' });
  } catch (error: any) {
    console.error('Error saving PRs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
