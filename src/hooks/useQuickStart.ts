'use client';

import { useRouter } from 'next/navigation';
import { getUserStorageKey } from '@/lib/storage';

export interface QuickStartOverrides {
  goal?: string;
  location?: string;
  experience?: string;
  timelineDays?: number;
  equipment?: string[];
}

export interface QuickStartBaseState {
  qsMode?: string;
  qsGoal?: string;
  qsLocation?: string;
  qsExperience?: string;
  qsTimelineDays?: number;
  qsDuration?: number;
  qsDaysPerWeek?: number;
  qsEquipment?: string[];
}

export function useQuickStart() {
  const router = useRouter();

  const handleQuickStart = (overrides?: QuickStartOverrides, baseState?: QuickStartBaseState) => {
    try {
      // Check if user already has an active plan
      const storageKey = getUserStorageKey('leanverse_transformation');
      if (localStorage.getItem(storageKey)) {
        if (confirm('You already have an active transformation plan! Please go to the planner to view it or discard it first before creating a new one. Go to Planner now?')) {
          router.push('/workout-planner');
        }
        return;
      }

      // Store pending configuration in localStorage to be picked up by the planner after login
      localStorage.setItem('leanverse_pending_wizard', JSON.stringify({
        goal: baseState?.qsMode === 'custom' ? 'custom plan' : (overrides?.goal || baseState?.qsGoal || 'muscle'),
        location: overrides?.location || baseState?.qsLocation || 'gym',
        experience: overrides?.experience || baseState?.qsExperience || 'beginner',
        timelineDays: overrides?.timelineDays || baseState?.qsTimelineDays || 90,
        duration: baseState?.qsDuration || 60,
        daysPerWeek: baseState?.qsDaysPerWeek || 4,
        equipment: overrides?.equipment || baseState?.qsEquipment || [],
        autoGenerate: true
      }));
    } catch {}
    
    // The workout planner route is protected, so this will ultimately force a login
    // then redirect back to the planner!
    router.push('/workout-planner');
  };

  return { handleQuickStart };
}
