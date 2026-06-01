/**
 * gamification.ts
 * Streak calculation and volume-based leveling system.
 * All functions read directly from localStorage and are safe to call on the server
 * (they guard with typeof window check).
 */

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
  { name: 'Beginner',     emoji: '🌱', color: 'text-slate-400',   bgColor: 'bg-slate-400/10',   borderColor: 'border-slate-400/30',   minVolume: 0,     maxVolume: 1000 },
  { name: 'Intermediate', emoji: '💪', color: 'text-blue-400',    bgColor: 'bg-blue-400/10',    borderColor: 'border-blue-400/30',    minVolume: 1001,  maxVolume: 5000 },
  { name: 'Advanced',     emoji: '🔥', color: 'text-orange-400',  bgColor: 'bg-orange-400/10',  borderColor: 'border-orange-400/30',  minVolume: 5001,  maxVolume: 15000 },
  { name: 'Elite',        emoji: '⚡', color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', borderColor: 'border-emerald-400/30', minVolume: 15001, maxVolume: null },
];

/**
 * Safely parse the workouts DB from localStorage.
 * Returns an empty object if unavailable, invalid JSON, or on the server.
 */
function getWorkoutsDb(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('leanverse_workouts_db');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    return parsed as Record<string, unknown>;
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
  const toDateStr = (d: Date) => d.toISOString().split('T')[0];

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
  const todayStr = new Date().toISOString().split('T')[0];
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
export function getTodayWorkoutSummary(): { name: string; completedSets: number; totalSets: number } {
  const db = getWorkoutsDb();
  const todayStr = new Date().toISOString().split('T')[0];
  const entry = db[todayStr];
  const fallback = { name: 'No workout logged today', completedSets: 0, totalSets: 0 };

  if (!entry || typeof entry !== 'object' || entry === null) return fallback;
  const e = entry as Record<string, unknown>;
  const name = typeof e.name === 'string' ? e.name : 'Today\'s Workout';
  const exercises = Array.isArray(e.exercises) ? e.exercises : [];

  let completedSets = 0;
  let totalSets = 0;

  for (const ex of exercises) {
    if (!ex || typeof ex !== 'object' || ex === null) continue;
    const sets = (ex as Record<string, unknown>).sets;
    if (!Array.isArray(sets)) continue;
    totalSets += sets.length;
    completedSets += sets.filter((s: unknown) => {
      if (!s || typeof s !== 'object' || s === null) return false;
      return (s as Record<string, unknown>).completed === true;
    }).length;
  }

  return { name, completedSets, totalSets };
}
