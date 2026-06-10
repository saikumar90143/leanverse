/**
 * gamification.ts
 * Streak calculation and volume-based leveling system.
 * All functions read directly from localStorage and are safe to call on the server
 * (they guard with typeof window check).
 */
import { getUserStorageKey, formatLocalDate } from './storage';
import { exerciseDatabase } from './exerciseDatabase';

export interface Level {
  name: string;
  emoji: string;
  color: string;       // Tailwind text-color class
  bgColor: string;     // Tailwind bg-color class
  borderColor: string; // Tailwind border-color class
  minVolume: number;
  maxVolume: number | null;
}

export const LEVELS: Level[] = [
  { name: 'Beginner',     emoji: '🌱', color: 'text-muted',   bgColor: 'bg-slate-400/10',   borderColor: 'border-border/30',   minVolume: 0,     maxVolume: 1000 },
  { name: 'Intermediate', emoji: '💪', color: 'text-blue-400',    bgColor: 'bg-blue-400/10',    borderColor: 'border-blue-400/30',    minVolume: 1001,  maxVolume: 5000 },
  { name: 'Advanced',     emoji: '🔥', color: 'text-orange-400',  bgColor: 'bg-orange-400/10',  borderColor: 'border-orange-400/30',  minVolume: 5001,  maxVolume: 15000 },
  { name: 'Elite',        emoji: '⚡', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/30', minVolume: 15001, maxVolume: null },
];

let memoryCache: Record<string, unknown> | null = null;
let cacheTime = 0;
/**
 * Force-clears the in-memory workouts cache so next read hits localStorage.
 * Call this whenever a workout is logged/updated.
 */
export function clearWorkoutsCache(): void {
  memoryCache = null;
  cacheTime = 0;
}


/**
 * Safely parse the workouts DB from localStorage with a 2-second in-memory cache.
 * Returns an empty object if unavailable, invalid JSON, or on the server.
 */
function getWorkoutsDb(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  
  // Cache for 2 seconds to prevent massive main-thread blocking on page loads
  if (memoryCache && Date.now() - cacheTime < 2000) {
    return memoryCache;
  }

  try {
    const raw = localStorage.getItem(getUserStorageKey('leanverse_workouts_db'));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    
    memoryCache = parsed as Record<string, unknown>;
    cacheTime = Date.now();
    return memoryCache;
  } catch {
    return {};
  }
}

/**
 * Check if a workout entry for a given date has at least one completed set.
 */
function hasCompletedSetForDate(db: Record<string, unknown>, dateStr: string): boolean {
  const entry = db[dateStr];
  if (!entry || typeof entry !== 'object' || entry === null) return false;
  const exercises = (entry as Record<string, unknown>).exercises;
  if (!Array.isArray(exercises)) return false;
  return exercises.some((ex: unknown) => {
    if (!ex || typeof ex !== 'object' || ex === null) return false;
    const sets = (ex as Record<string, unknown>).sets;
    if (!Array.isArray(sets)) return false;
    return sets.some((s: unknown) => {
      if (!s || typeof s !== 'object' || s === null) return false;
      return (s as Record<string, unknown>).completed === true;
    });
  });
}

/**
 * Returns the current consecutive workout streak (days).
 * A day counts if there is at least 1 completed set.
 * Streak continues if today or yesterday has a workout; otherwise resets.
 */
export function getStreak(): number {
  const db = getWorkoutsDb();
  if (Object.keys(db).length === 0) return 0;

  let streak = 0;
  const today = new Date();
  // Check today first; if no workout today, still check yesterday to preserve streak
  // that hasn't been broken yet today.
  let checkDate = new Date(today);

  // Normalize to local date string YYYY-MM-DD
  const toDateStr = (d: Date) => formatLocalDate(d);

  // Start from today; if today has no workout, start from yesterday (grace period)
  const todayStr = toDateStr(today);
  if (!hasCompletedSetForDate(db, todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count consecutive days backwards
  for (let i = 0; i < 365; i++) {
    const dateStr = toDateStr(checkDate);
    if (hasCompletedSetForDate(db, dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates the total lifetime volume (kg) from all completed sets in the DB.
 */
export function getLifetimeVolume(): number {
  const db = getWorkoutsDb();
  let total = 0;

  for (const entry of Object.values(db)) {
    if (!entry || typeof entry !== 'object' || entry === null) continue;
    const exercises = (entry as Record<string, unknown>).exercises;
    if (!Array.isArray(exercises)) continue;

    for (const ex of exercises) {
      if (!ex || typeof ex !== 'object' || ex === null) continue;
      const sets = (ex as Record<string, unknown>).sets;
      if (!Array.isArray(sets)) continue;

      for (const s of sets) {
        if (!s || typeof s !== 'object' || s === null) continue;
        const set = s as Record<string, unknown>;
        if (set.completed !== true) continue;
        const weight = typeof set.weight === 'number' ? set.weight : 0;
        const reps = typeof set.reps === 'number' ? set.reps : 0;
        total += weight * reps;
      }
    }
  }

  return Math.round(total);
}

/**
 * Returns the current Level object based on lifetime volume.
 */
export function getUserLevel(lifetimeVolume: number): Level {
  const vol = typeof lifetimeVolume === 'number' && isFinite(lifetimeVolume) ? lifetimeVolume : 0;
  // Find highest level the user has reached
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (vol >= LEVELS[i].minVolume) return LEVELS[i];
  }
  return LEVELS[0];
}

/**
 * Returns the progress (0–1) towards the next level.
 * Returns 1 if at max level.
 */
export function getLevelProgress(lifetimeVolume: number): number {
  const vol = typeof lifetimeVolume === 'number' && isFinite(lifetimeVolume) ? lifetimeVolume : 0;
  const level = getUserLevel(vol);
  if (level.maxVolume === null) return 1; // Elite — max level
  const range = level.maxVolume - level.minVolume;
  if (range <= 0) return 1;
  return Math.min(1, (vol - level.minVolume) / range);
}

/**
 * Returns today's total workout volume (completed sets only).
 */
export function getTodayVolume(): number {
  const db = getWorkoutsDb();
  const todayStr = formatLocalDate();
  const entry = db[todayStr];
  if (!entry || typeof entry !== 'object' || entry === null) return 0;

  let total = 0;
  const exercises = (entry as Record<string, unknown>).exercises;
  if (!Array.isArray(exercises)) return 0;

  for (const ex of exercises) {
    if (!ex || typeof ex !== 'object' || ex === null) continue;
    const sets = (ex as Record<string, unknown>).sets;
    if (!Array.isArray(sets)) continue;
    for (const s of sets) {
      if (!s || typeof s !== 'object' || s === null) continue;
      const set = s as Record<string, unknown>;
      if (set.completed !== true) continue;
      const weight = typeof set.weight === 'number' ? set.weight : 0;
      const reps = typeof set.reps === 'number' ? set.reps : 0;
      total += weight * reps;
    }
  }
  return Math.round(total);
}

/**
 * Returns today's workout name and completed set count. 
 */
export function getTodayWorkoutSummary(): { name: string; completedSets: number; totalSets: number; caloriesBurned: number } {
  const db = getWorkoutsDb();
  const todayStr = formatLocalDate();
  const entry = db[todayStr];
  const fallback = { name: 'No workout logged today', completedSets: 0, totalSets: 0, caloriesBurned: 0 };

  if (!entry || typeof entry !== 'object' || entry === null) return fallback;
  const e = entry as Record<string, unknown>;
  const name = typeof e.name === 'string' ? e.name : 'Today\'s Workout';
  const exercises = Array.isArray(e.exercises) ? e.exercises : [];

  let completedSets = 0;
  let totalSets = 0;
  let caloriesBurned = 0;

  for (const ex of exercises) {
    if (!ex || typeof ex !== 'object' || ex === null) continue;
    
    const exName = typeof (ex as Record<string, unknown>).name === 'string' ? (ex as Record<string, unknown>).name as string : '';
    const dbMatch = exerciseDatabase.find(e => e.name.toLowerCase() === exName.toLowerCase().trim());
    const calsPerMin = dbMatch ? dbMatch.caloriesPerMinute : 6;

    const sets = (ex as Record<string, unknown>).sets;
    if (!Array.isArray(sets)) continue;
    totalSets += sets.length;
    
    const exCompletedSets = sets.filter((s: unknown) => {
      if (!s || typeof s !== 'object' || s === null) return false;
      return (s as Record<string, unknown>).completed === true;
    }).length;

    completedSets += exCompletedSets;
    // Assume 1.5 minutes active/rest time per set
    caloriesBurned += exCompletedSets * 1.5 * calsPerMin;
  }

  return { name, completedSets, totalSets, caloriesBurned: Math.round(caloriesBurned) };
}

/**
 * Generates data for the 30-day contribution graph (Heatmap).
 */
export function getHeatmapData(days: number = 30): { date: string; hasWorkout: boolean; volume: number; calories: number }[] {
  const db = getWorkoutsDb();
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatLocalDate(d);
    
    const entry = db[dateStr];
    let hasWorkout = false;
    let volume = 0;
    let calories = 0;
    
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
      const exercises = (entry as Record<string, unknown>).exercises;
      if (Array.isArray(exercises)) {
        for (const ex of exercises) {
          if (!ex || typeof ex !== 'object' || ex === null) continue;

          const exName = typeof (ex as Record<string, unknown>).name === 'string' ? (ex as Record<string, unknown>).name as string : '';
          const dbMatch = exerciseDatabase.find(e => e.name.toLowerCase() === exName.toLowerCase().trim());
          const calsPerMin = dbMatch ? dbMatch.caloriesPerMinute : 6;

          const sets = (ex as Record<string, unknown>).sets;
          if (Array.isArray(sets)) {
            for (const s of sets) {
              if (!s || typeof s !== 'object' || s === null) continue;
              const set = s as Record<string, unknown>;
              if (set.completed === true) {
                hasWorkout = true;
                const weight = typeof set.weight === 'number' ? set.weight : 0;
                const reps = typeof set.reps === 'number' ? set.reps : 0;
                volume += weight * reps;
                calories += 1.5 * calsPerMin;
              }
            }
          }
        }
      }
    }
    
    data.push({ date: dateStr, hasWorkout, volume: Math.round(volume), calories: Math.round(calories) });
  }
  
  return data;
}

const DAILY_CHALLENGES = [
  { id: 'c1', title: 'The Century Club', desc: 'Complete 100 total reps across any exercises today.', icon: '💯' },
  { id: 'c2', title: 'Heavy Lifter', desc: 'Log a workout with over 5,000kg of total volume.', icon: '🏋️' },
  { id: 'c3', title: 'Core Crusher', desc: 'Complete at least 3 sets of Plank or Crunches.', icon: '🧘' },
  { id: 'c4', title: 'Cardio Engine', desc: 'Log at least 1 set of HIIT Sprints or Treadmill.', icon: '🏃' },
  { id: 'c5', title: 'Leg Day Hero', desc: 'Complete 5 sets of any Squat variation.', icon: '🦵' },
  { id: 'c6', title: 'Consistency is Key', desc: 'Simply log a workout with at least 1 completed set.', icon: '🔥' },
  { id: 'c7', title: 'Push/Pull Master', desc: 'Log at least one push exercise and one pull exercise.', icon: '💪' }
];

/**
 * Returns a deterministic Daily Challenge based on the current date,
 * and checks if the user has completed it today.
 */
export function getDailyChallenge(): { title: string; desc: string; icon: string; completed: boolean } {
  const db = getWorkoutsDb();
  const today = new Date();
  const dateStr = formatLocalDate(today);
  
  // Deterministic selection based on day of month
  const challenge = DAILY_CHALLENGES[today.getDate() % DAILY_CHALLENGES.length];
  
  // Check completion
  let completed = false;
  const entry = db[dateStr];
  if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
    const exercises = (entry as Record<string, unknown>).exercises;
    if (Array.isArray(exercises)) {
      let totalReps = 0;
      let totalVolume = 0;
      let hasCore = false;
      let hasCardio = false;
      let squatSets = 0;
      let hasPush = false;
      let hasPull = false;
      let validSets = 0;

      for (const ex of exercises) {
        if (!ex || typeof ex !== 'object') continue;
        const e = ex as Record<string, unknown>;
        const name = (typeof e.name === 'string' ? e.name : '').toLowerCase();
        const sets = Array.isArray(e.sets) ? e.sets : [];
        
        for (const s of sets) {
          if (!s || typeof s !== 'object') continue;
          const set = s as Record<string, unknown>;
          if (set.completed === true) {
            validSets++;
            const reps = typeof set.reps === 'number' ? set.reps : 0;
            const weight = typeof set.weight === 'number' ? set.weight : 0;
            
            totalReps += reps;
            totalVolume += (reps * weight);
            
            if (name.includes('plank') || name.includes('crunch')) hasCore = true;
            if (name.includes('sprint') || name.includes('treadmill') || name.includes('cardio')) hasCardio = true;
            if (name.includes('squat')) squatSets++;
            if (name.includes('press') || name.includes('push') || name.includes('dip')) hasPush = true;
            if (name.includes('pull') || name.includes('row') || name.includes('curl')) hasPull = true;
          }
        }
      }

      switch (challenge.id) {
        case 'c1': completed = totalReps >= 100; break;
        case 'c2': completed = totalVolume >= 5000; break;
        case 'c3': completed = hasCore && validSets >= 3; break;
        case 'c4': completed = hasCardio; break;
        case 'c5': completed = squatSets >= 5; break;
        case 'c6': completed = validSets >= 1; break;
        case 'c7': completed = hasPush && hasPull; break;
      }
    }
  }

  return {
    title: challenge.title,
    desc: challenge.desc,
    icon: challenge.icon,
    completed
  };
}
/**
 * Returns the best (longest) consecutive workout streak ever.
 */
export function getBestStreak(): number {
  const db = getWorkoutsDb();
  const dates = Object.keys(db).filter(d => hasCompletedSetForDate(db, d)).sort();
  if (dates.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}

/**
 * Returns the total number of days where at least one workout set was completed.
 */
export function getTotalWorkoutsCompleted(): number {
  const db = getWorkoutsDb();
  return Object.keys(db).filter(d => hasCompletedSetForDate(db, d)).length;
}

/**
 * Returns weekly goal progress for the current Mon–Sun week.
 */
export function getWeeklyGoalProgress(weeklyGoalTarget: number = 4): {
  completed: number;
  goal: number;
  percentage: number;
  days: { date: string; dayName: string; hasWorkout: boolean; isToday: boolean; isFuture: boolean }[];
} {
  const db = getWorkoutsDb();
  const today = new Date();
  const todayStr = formatLocalDate(today);

  // Find Monday of current week
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = [];
  let completed = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatLocalDate(d);
    const hasWorkout = hasCompletedSetForDate(db, dateStr);
    const isToday = dateStr === todayStr;
    const isFuture = d > today && !isToday;

    if (hasWorkout) completed++;
    days.push({ date: dateStr, dayName: dayNames[i], hasWorkout, isToday, isFuture });
  }

  return {
    completed,
    goal: weeklyGoalTarget,
    percentage: Math.round((completed / weeklyGoalTarget) * 100),
    days,
  };
}

/**
 * Returns consistency score (%) over the past 30 days — ratio of workout days to total days.
 */
export function getConsistencyScore(days: number = 30): number {
  const db = getWorkoutsDb();
  const today = new Date();
  let workoutDays = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (hasCompletedSetForDate(db, formatLocalDate(d))) workoutDays++;
  }
  return Math.round((workoutDays / days) * 100);
}

/**
 * Returns average workouts per week over the past 4 weeks.
 */
export function getAvgWorkoutsPerWeek(): number {
  const db = getWorkoutsDb();
  const today = new Date();
  let total = 0;
  for (let i = 0; i < 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (hasCompletedSetForDate(db, formatLocalDate(d))) total++;
  }
  return Math.round((total / 4) * 10) / 10;
}

// ─── Streak Freeze ───────────────────────────────────────────────────────────

export interface StreakFreezeState {
  available: number;
  usedDates: string[];
  lastResetMonth: string; // "YYYY-MM"
}

export function getStreakFreeze(): StreakFreezeState {
  if (typeof window === 'undefined') return { available: 1, usedDates: [], lastResetMonth: '' };
  try {
    const raw = localStorage.getItem(getUserStorageKey('leanverse_streak_freeze'));
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    if (!raw) return { available: 1, usedDates: [], lastResetMonth: currentMonth };

    const state: StreakFreezeState = JSON.parse(raw);
    // Reset monthly
    if (state.lastResetMonth !== currentMonth) {
      const reset = { available: 1, usedDates: state.usedDates, lastResetMonth: currentMonth };
      localStorage.setItem(getUserStorageKey('leanverse_streak_freeze'), JSON.stringify(reset));
      return reset;
    }
    return state;
  } catch {
    return { available: 1, usedDates: [], lastResetMonth: '' };
  }
}

export function useStreakFreeze(dateStr: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const state = getStreakFreeze();
    if (state.available <= 0) return false;
    const updated: StreakFreezeState = {
      ...state,
      available: state.available - 1,
      usedDates: [...state.usedDates, dateStr],
    };
    localStorage.setItem(getUserStorageKey('leanverse_streak_freeze'), JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

// ─── Achievements / Badges ────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
}

const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first_workout',    name: 'First Step',        desc: 'Complete your very first workout.',          emoji: '🏁', tier: 'bronze' as const,   threshold: (s: number, t: number) => t >= 1 },
  { id: 'streak_3',         name: '3-Day Streak',       desc: 'Work out 3 days in a row.',                 emoji: '🥉', tier: 'bronze' as const,   threshold: (s: number) => s >= 3 },
  { id: 'streak_7',         name: 'Week Warrior',       desc: 'Maintain a 7-day workout streak.',          emoji: '🥈', tier: 'silver' as const,   threshold: (s: number) => s >= 7 },
  { id: 'streak_14',        name: 'Fortnight Fighter',  desc: '14 consecutive days of training.',          emoji: '💪', tier: 'silver' as const,   threshold: (s: number) => s >= 14 },
  { id: 'streak_30',        name: 'Iron Discipline',    desc: '30-day unbroken streak — incredible!',      emoji: '🥇', tier: 'gold' as const,     threshold: (s: number) => s >= 30 },
  { id: 'streak_60',        name: 'Two Month Titan',    desc: '60 straight days of consistency.',          emoji: '🔥', tier: 'gold' as const,     threshold: (s: number) => s >= 60 },
  { id: 'streak_90',        name: 'Habit Locked',       desc: '90 days — you\'ve built a real habit.',     emoji: '⚡', tier: 'platinum' as const, threshold: (s: number) => s >= 90 },
  { id: 'streak_365',       name: 'Year of the Beast',  desc: '365-day streak — legendary status!',        emoji: '🏆', tier: 'legendary' as const, threshold: (s: number) => s >= 365 },
  { id: 'workouts_10',      name: 'Getting Started',    desc: 'Complete 10 total workouts.',               emoji: '🌱', tier: 'bronze' as const,   threshold: (_: number, t: number) => t >= 10 },
  { id: 'workouts_25',      name: 'Quarter Century',    desc: 'Complete 25 total workouts.',               emoji: '💯', tier: 'silver' as const,   threshold: (_: number, t: number) => t >= 25 },
  { id: 'workouts_50',      name: 'Halfway to Hundred', desc: 'Complete 50 total workouts.',               emoji: '🔥', tier: 'gold' as const,     threshold: (_: number, t: number) => t >= 50 },
  { id: 'workouts_100',     name: 'Centurion',          desc: '100 workouts completed. Elite level.',      emoji: '💎', tier: 'platinum' as const, threshold: (_: number, t: number) => t >= 100 },
  { id: 'consistency_80',   name: 'Consistent Athlete', desc: '80%+ monthly consistency score.',           emoji: '📈', tier: 'gold' as const,     threshold: (_s: number, _t: number, c: number) => c >= 80 },
];

export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return ACHIEVEMENT_DEFINITIONS.map(a => ({ ...a, unlocked: false }));

  const streak = getStreak();
  const total = getTotalWorkoutsCompleted();
  const consistency = getConsistencyScore();

  let saved: Record<string, string> = {};
  try {
    const raw = localStorage.getItem(getUserStorageKey('leanverse_achievements'));
    if (raw) saved = JSON.parse(raw);
  } catch {}

  const achievements: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(def => {
    const unlocked = def.threshold(streak, total, consistency);
    const unlockedDate = saved[def.id] || (unlocked ? formatLocalDate() : undefined);
    if (unlocked && !saved[def.id]) {
      saved[def.id] = formatLocalDate();
    }
    return { id: def.id, name: def.name, desc: def.desc, emoji: def.emoji, tier: def.tier, unlocked, unlockedDate };
  });

  try {
    localStorage.setItem(getUserStorageKey('leanverse_achievements'), JSON.stringify(saved));
  } catch {}

  return achievements;
}

// ─── Milestone celebration tracker ───────────────────────────────────────────

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365];

export function getUnseenMilestone(): number | null {
  if (typeof window === 'undefined') return null;
  const streak = getStreak();
  try {
    const raw = localStorage.getItem(getUserStorageKey('leanverse_seen_milestones'));
    const seen: number[] = raw ? JSON.parse(raw) : [];
    const milestone = STREAK_MILESTONES.find(m => streak >= m && !seen.includes(m));
    return milestone ?? null;
  } catch {
    return null;
  }
}

export function markMilestoneSeen(milestone: number): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(getUserStorageKey('leanverse_seen_milestones'));
    const seen: number[] = raw ? JSON.parse(raw) : [];
    if (!seen.includes(milestone)) {
      seen.push(milestone);
      localStorage.setItem(getUserStorageKey('leanverse_seen_milestones'), JSON.stringify(seen));
    }
  } catch {}
}
