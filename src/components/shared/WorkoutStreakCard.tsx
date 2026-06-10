'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Flame, Trophy, Target, TrendingUp, Snowflake, ChevronRight, Zap } from 'lucide-react';
import {
  getStreak,
  getBestStreak,
  getTotalWorkoutsCompleted,
  getWeeklyGoalProgress,
  getConsistencyScore,
  getStreakFreeze,
  clearWorkoutsCache,
  STREAK_MILESTONES,
} from '@/lib/gamification';

interface WorkoutStreakCardProps {
  compact?: boolean;
  weeklyGoal?: number;
  hideLink?: boolean;
}

function AnimatedCounter({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{display}</>;
}

export default function WorkoutStreakCard({ compact = false, weeklyGoal = 4, hideLink = false }: WorkoutStreakCardProps) {
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [weekly, setWeekly] = useState({ completed: 0, goal: weeklyGoal, percentage: 0 });
  const [consistency, setConsistency] = useState(0);
  const [freezeAvailable, setFreezeAvailable] = useState(0);

  const refreshData = useCallback(() => {
    clearWorkoutsCache();
    const s = getStreak();
    const b = getBestStreak();
    const t = getTotalWorkoutsCompleted();
    const w = getWeeklyGoalProgress(weeklyGoal);
    const c = getConsistencyScore();
    const f = getStreakFreeze();

    setStreak(s);
    setBestStreak(Math.max(s, b));
    setTotalWorkouts(t);
    setWeekly({ completed: w.completed, goal: weeklyGoal, percentage: w.percentage });
    setConsistency(c);
    setFreezeAvailable(f.available);
    setMounted(true);
  }, [weeklyGoal]);

  useEffect(() => {
    refreshData();

    // Re-read when localStorage changes in any tab
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.includes('leanverse_workouts_db')) refreshData();
    };

    // Re-read when user switches back to this tab/page
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshData();
    };

    // Re-read on custom event dispatched by workout planner after a set is completed
    const onWorkoutLogged = () => refreshData();

    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('leanverse-workout-logged', onWorkoutLogged);

    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('leanverse-workout-logged', onWorkoutLogged);
    };
  }, [refreshData]);

  // Next milestone
  const nextMilestone = STREAK_MILESTONES.find(m => m > streak) ?? null;
  const daysToMilestone = nextMilestone ? nextMilestone - streak : 0;

  if (!mounted) {
    return (
      <div className={`glass rounded-3xl border border-border/10 animate-pulse ${compact ? 'p-4' : 'p-6'}`}>
        <div className="h-20 bg-secondary/30 rounded-2xl" />
      </div>
    );
  }

  if (compact) {
    return (
      <Link href="/streak" className="block glass rounded-2xl border border-amber-500/20 p-4 hover:border-amber-500/40 transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Current Streak</p>
              <p className="text-xl font-black text-amber-500">
                <AnimatedCounter value={streak} /> <span className="text-xs text-muted font-bold">Days</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Weekly</p>
            <p className="text-sm font-black text-foreground">{weekly.completed}/{weekly.goal}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-amber-500 transition-colors ml-1" />
        </div>
        {/* Mini progress bar */}
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(weekly.percentage, 100)}%` }}
          />
        </div>
      </Link>
    );
  }

  return (
    <div className="glass rounded-3xl border border-amber-500/20 p-6 space-y-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h2 className="text-sm font-black text-foreground uppercase tracking-widest">Workout Streak</h2>
        </div>
        {freezeAvailable > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-xs font-bold">
            <Snowflake className="w-3 h-3" />
            <span>{freezeAvailable} Freeze</span>
          </div>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current Streak */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-2xl p-4 border border-amber-500/20 text-center">
          <Flame className="w-6 h-6 text-amber-500 fill-amber-400 mx-auto mb-1 animate-pulse" />
          <p className="text-3xl font-black text-amber-500">
            <AnimatedCounter value={streak} />
          </p>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Current Streak</p>
          <p className="text-xs text-amber-500/70 font-bold mt-0.5">
            {streak === 1 ? '1 Day' : `${streak} Days`}
          </p>
        </div>

        {/* Best Streak */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 rounded-2xl p-4 border border-emerald-500/20 text-center">
          <Trophy className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-3xl font-black text-emerald-500">
            <AnimatedCounter value={bestStreak} />
          </p>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Best Streak</p>
          <p className="text-xs text-emerald-500/70 font-bold mt-0.5">
            {bestStreak === 1 ? '1 Day' : `${bestStreak} Days`}
          </p>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-black text-foreground uppercase tracking-widest">Weekly Goal</span>
          </div>
          <span className="text-sm font-black text-cyan-500">
            {weekly.completed} / {weekly.goal} Workouts
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(weekly.percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted font-bold">
          <span>{weekly.percentage}% Complete</span>
          <span>{weekly.goal - weekly.completed > 0 ? `${weekly.goal - weekly.completed} more to go` : '🎉 Goal reached!'}</span>
        </div>
      </div>

      {/* Consistency Score */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-black text-foreground uppercase tracking-widest">30-Day Consistency</span>
          </div>
          <span className="text-sm font-black text-purple-500">{consistency}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${consistency}%`,
              background: consistency >= 80 ? 'linear-gradient(to right, #a855f7, #ec4899)' :
                          consistency >= 60 ? 'linear-gradient(to right, #8b5cf6, #7c3aed)' :
                          'linear-gradient(to right, #6366f1, #4f46e5)'
            }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/30 rounded-2xl p-3 text-center">
          <p className="text-lg font-black text-foreground">
            <AnimatedCounter value={totalWorkouts} />
          </p>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Workouts</p>
        </div>
        <div className="bg-secondary/30 rounded-2xl p-3 text-center">
          {nextMilestone ? (
            <>
              <p className="text-lg font-black text-amber-500">{daysToMilestone}</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Days to {nextMilestone}-Day</p>
            </>
          ) : (
            <>
              <p className="text-lg font-black text-amber-500">🏆</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">All Milestones!</p>
            </>
          )}
        </div>
      </div>

      {/* CTA */}
      {!hideLink && (
        <Link
          href="/streak"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-sm hover:from-amber-500/20 hover:to-orange-500/20 transition-all"
        >
          <Zap className="w-4 h-4" />
          View Full Streak Dashboard
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
