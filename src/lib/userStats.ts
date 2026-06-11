/**
 * userStats.ts
 * Eager Incremental Aggregation engine for O(1) Gamification and PR access.
 */
import { getUserStorageKey, formatLocalDate } from './storage';
import { exerciseDatabase } from './exerciseDatabase';

export interface UserStatsCache {
  lifetimeVolume: number;
  streak: number;
  bestStreak: number;
  lastWorkoutDate: string | null;
  totalWorkouts: number;
  prs: Record<string, {
    maxWeight: number;
    maxReps: number;
    maxRepsAtMaxWeight: number;
    estimated1RM: number;
    lastPerformed: string;
  }>;
}

const DEFAULT_STATS: UserStatsCache = {
  lifetimeVolume: 0,
  streak: 0,
  bestStreak: 0,
  lastWorkoutDate: null,
  totalWorkouts: 0,
  prs: {}
};

/**
 * Returns the cached stats in O(1) time.
 * If not found, it lazily falls back to a full DB recalculation once,
 * saves it, and then returns.
 */
export function getUserStats(): UserStatsCache {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(getUserStorageKey('leanverse_user_stats'));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse user stats cache', e);
  }
  // Fallback trigger recalculation
  return recalculateAllStats();
}

/**
 * Updates the O(1) cache.
 */
export function saveUserStats(stats: UserStatsCache): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getUserStorageKey('leanverse_user_stats'), JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

/**
 * Recalculates EVERYTHING from scratch (the old O(N) way).
 * Called only once during migration or if the cache is lost.
 */
export function recalculateAllStats(): UserStatsCache {
  if (typeof window === 'undefined') return DEFAULT_STATS;

  const stats: UserStatsCache = { ...DEFAULT_STATS, prs: {} };
  
  // 1. Calculate PRs from leanverse_transformation & leanverse_preserved_stats
  let history: Record<string, any[]> = {};
  const activeStateStr = localStorage.getItem(getUserStorageKey('leanverse_transformation'));
  if (activeStateStr) {
    const activeState = JSON.parse(activeStateStr);
    if (activeState.exerciseHistory) history = activeState.exerciseHistory;
  } else {
    const preservedStr = localStorage.getItem(getUserStorageKey('leanverse_preserved_stats'));
    if (preservedStr) {
      const preservedState = JSON.parse(preservedStr);
      if (preservedState.exerciseHistory) history = preservedState.exerciseHistory;
    }
  }

  Object.entries(history).forEach(([exerciseId, records]) => {
    if (!records || records.length === 0) return;

    let maxWeight = 0;
    let maxRepsAtMaxWeight = 0;
    let absoluteMaxReps = 0;
    let lastPerformed = records[records.length - 1].date;

    records.forEach(record => {
      record.weightUsed.forEach((weightStr: string, idx: number) => {
        const w = parseFloat(weightStr);
        const reps = parseInt(record.repsAchieved[idx]) || 0;
        
        if (isNaN(w) || weightStr.toLowerCase().includes('body')) {
          if (reps > absoluteMaxReps) absoluteMaxReps = reps;
        } else {
          if (w > maxWeight) {
            maxWeight = w;
            maxRepsAtMaxWeight = reps;
          } else if (w === maxWeight && reps > maxRepsAtMaxWeight) {
            maxRepsAtMaxWeight = reps;
          }
          if (reps > absoluteMaxReps) absoluteMaxReps = reps;
        }
      });
    });

    let est1RM = 0;
    if (maxWeight > 0 && maxRepsAtMaxWeight > 0) {
      est1RM = maxWeight * (36 / (37 - maxRepsAtMaxWeight));
    }

    stats.prs[exerciseId] = {
      maxWeight,
      maxReps: absoluteMaxReps,
      maxRepsAtMaxWeight,
      estimated1RM: Math.round(est1RM),
      lastPerformed
    };
  });

  // 2. Calculate Gamification Stats from leanverse_workouts_db
  let db: Record<string, any> = {};
  try {
    const dbRaw = localStorage.getItem(getUserStorageKey('leanverse_workouts_db'));
    if (dbRaw) db = JSON.parse(dbRaw);
  } catch (e) {}

  let lifetimeVolume = 0;
  let totalWorkouts = 0;
  
  for (const dateStr of Object.keys(db)) {
    const entry = db[dateStr];
    if (!entry || !entry.exercises || !Array.isArray(entry.exercises)) continue;
    
    let hasCompletedSet = false;
    if (entry.exercises.length === 0) hasCompletedSet = true; // Rest day

    for (const ex of entry.exercises) {
      if (!ex.sets || !Array.isArray(ex.sets)) continue;
      for (const s of ex.sets) {
        if (s.completed === true) {
          hasCompletedSet = true;
          const weight = typeof s.weight === 'number' ? s.weight : 0;
          const reps = typeof s.reps === 'number' ? s.reps : 0;
          lifetimeVolume += weight * reps;
        }
      }
    }
    if (hasCompletedSet) totalWorkouts++;
  }
  
  stats.lifetimeVolume = Math.round(lifetimeVolume);
  stats.totalWorkouts = totalWorkouts;

  // Calculate Streak
  if (Object.keys(db).length > 0) {
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    const todayStr = formatLocalDate(today);
    
    const hasCompletedSetForDate = (dateStr: string) => {
      const e = db[dateStr];
      if (!e || !Array.isArray(e.exercises)) return false;
      if (e.exercises.length === 0) return true;
      return e.exercises.some((ex: any) => ex.sets && ex.sets.some((set: any) => set.completed));
    };

    if (!hasCompletedSetForDate(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    for (let i = 0; i < 365; i++) {
      const dateStr = formatLocalDate(checkDate);
      if (hasCompletedSetForDate(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    stats.streak = streak;

    let best = 1;
    let current = 1;
    const dates = Object.keys(db).filter(d => hasCompletedSetForDate(d)).sort();
    if (dates.length > 0) {
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
      stats.bestStreak = best;
    } else {
      stats.bestStreak = 0;
    }

    if (hasCompletedSetForDate(todayStr)) {
      stats.lastWorkoutDate = todayStr;
    } else {
      let yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      if (hasCompletedSetForDate(formatLocalDate(yesterday))) {
        stats.lastWorkoutDate = formatLocalDate(yesterday);
      }
    }
  }

  saveUserStats(stats);
  return stats;
}
