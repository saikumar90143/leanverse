'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Flame, Trophy, BarChart2, Calendar, Zap, Target,
  TrendingUp, Dumbbell, ChevronRight, Snowflake, AlertTriangle
} from 'lucide-react';
import {
  getStreak, getBestStreak, getTotalWorkoutsCompleted,
  getConsistencyScore, getAvgWorkoutsPerWeek, getStreakFreeze,
  useStreakFreeze, STREAK_MILESTONES
} from '@/lib/gamification';
import { getDailyMotivation } from '@/lib/motivationEngine';
import { getTodayWorkoutSummary } from '@/lib/gamification';
import { formatLocalDate as fld } from '@/lib/storage';

// Lazy load heavy components
const WorkoutStreakCard = dynamic(() => import('@/components/shared/WorkoutStreakCard'), { ssr: false });
const WeeklyWorkoutTracker = dynamic(() => import('@/components/shared/WeeklyWorkoutTracker'), { ssr: false });
const WorkoutHeatmap = dynamic(() => import('@/components/shared/WorkoutHeatmap'), { ssr: false });
const AchievementsBadges = dynamic(() => import('@/components/shared/AchievementsBadges'), { ssr: false });
const StreakMilestonePopup = dynamic(() => import('@/components/shared/StreakMilestonePopup'), { ssr: false });

export default function StreakPage() {
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [consistency, setConsistency] = useState(0);
  const [avgPerWeek, setAvgPerWeek] = useState(0);
  const [freeze, setFreeze] = useState({ available: 0, usedDates: [] as string[] });
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [freezeUsed, setFreezeUsed] = useState(false);
  const [todayWorkout, setTodayWorkout] = useState({ name: '', completedSets: 0, totalSets: 0, caloriesBurned: 0 });
  const motivation = getDailyMotivation();

  useEffect(() => {
    const s = getStreak();
    const b = getBestStreak();
    const t = getTotalWorkoutsCompleted();
    const c = getConsistencyScore();
    const avg = getAvgWorkoutsPerWeek();
    const f = getStreakFreeze();
    const tw = getTodayWorkoutSummary();

    setStreak(s);
    setBestStreak(Math.max(s, b));
    setTotal(t);
    setConsistency(c);
    setAvgPerWeek(avg);
    setFreeze(f);
    setTodayWorkout(tw);
    setMounted(true);

    // Check if streak at risk (no workout today)
    const todayStr = fld();
    const hasWorkoutToday = tw.completedSets > 0;
    if (s > 0 && !hasWorkoutToday && f.available > 0) {
      setTimeout(() => setShowFreezeModal(true), 1500);
    }
  }, []);

  const handleUseFreeze = () => {
    const todayStr = fld();
    const success = useStreakFreeze(todayStr);
    if (success) {
      setFreezeUsed(true);
      setFreeze(prev => ({ ...prev, available: prev.available - 1 }));
    }
    setShowFreezeModal(false);
  };

  // Next milestone
  const nextMilestone = STREAK_MILESTONES.find(m => m > streak) ?? null;

  // Analytics stats
  const analyticsStats = [
    { label: 'Current Streak', value: `${streak}d`, icon: Flame, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Best Streak', value: `${bestStreak}d`, icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Workouts', value: total.toString(), icon: Dumbbell, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Consistency', value: `${consistency}%`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Avg / Week', value: `${avgPerWeek}`, icon: BarChart2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Freeze Left', value: `${freeze.available}`, icon: Snowflake, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pt-24">

      {/* Milestone Popup */}
      <StreakMilestonePopup />

      {/* Streak at Risk Modal */}
      {showFreezeModal && !freezeUsed && streak > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="glass rounded-3xl border border-amber-500/30 p-8 max-w-sm w-full text-center space-y-5 shadow-2xl shadow-amber-500/10">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">Streak at Risk!</h3>
              <p className="text-sm text-muted font-bold mt-2">
                You haven't logged a workout today. Your <span className="text-amber-500 font-black">{streak}-day streak</span> is at risk of breaking!
              </p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
              <Snowflake className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">Use Streak Freeze?</p>
              <p className="text-xs text-muted font-bold mt-1">You have <span className="text-cyan-500">{freeze.available} freeze</span> available this month.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFreezeModal(false)}
                className="flex-1 py-3 rounded-2xl border border-border/10 bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-all"
              >
                Lose Streak
              </button>
              <button
                onClick={handleUseFreeze}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-black text-sm hover:opacity-90 transition-all shadow-lg"
              >
                ❄️ Use Freeze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
            <Flame className="w-7 h-7 text-amber-500 fill-amber-400" />
            Streak Dashboard
          </h1>
          <p className="text-sm text-muted font-bold mt-1">Track your consistency and celebrate your progress</p>
        </div>
        <Link
          href="/workout-planner"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <Dumbbell className="w-4 h-4" />
          <span className="hidden sm:inline">Log Workout</span>
        </Link>
      </div>

      {/* Daily Motivation */}
      <div className="glass rounded-2xl border border-emerald-500/20 p-4 flex items-center gap-4">
        <span className="text-3xl">{motivation.emoji}</span>
        <p className="font-bold text-foreground text-sm leading-relaxed flex-1">"{motivation.message}"</p>
      </div>

      {/* Today's Workout Reminder */}
      {mounted && todayWorkout.completedSets === 0 && (
        <div className="glass rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-black text-foreground">
              Don't break your {streak > 0 ? `${streak}-Day ` : ''}Streak! Today's workout awaits.
            </p>
            {todayWorkout.name !== 'No workout logged today' && (
              <p className="text-xs text-muted font-bold mt-0.5">{todayWorkout.name} • ~45 min</p>
            )}
          </div>
          <Link href="/workout-planner" className="text-xs font-black text-amber-500 hover:text-amber-400 flex items-center gap-1 shrink-0">
            Go <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* If freeze was used */}
      {freezeUsed && (
        <div className="glass rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 flex items-center gap-3">
          <Snowflake className="w-5 h-5 text-cyan-500 shrink-0" />
          <p className="text-sm font-black text-cyan-600 dark:text-cyan-400">
            ❄️ Streak Freeze used! Your streak is protected for today.
          </p>
        </div>
      )}

      {/* Main Streak Card */}
      <WorkoutStreakCard weeklyGoal={4} hideLink={true} />

      {/* Analytics Grid */}
      {mounted && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {analyticsStats.map(stat => (
            <div key={stat.label} className="glass rounded-2xl border border-border/10 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-black text-foreground">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-tight">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Next Milestone */}
      {nextMilestone && mounted && (
        <div className="glass rounded-2xl border border-amber-500/20 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-muted uppercase tracking-widest">Next Milestone</p>
            <p className="text-base font-black text-foreground mt-0.5">🎯 {nextMilestone}-Day Streak</p>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                style={{ width: `${Math.round((streak / nextMilestone) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted font-bold mt-1">{streak}/{nextMilestone} days • {nextMilestone - streak} more to go</p>
          </div>
        </div>
      )}

      {/* Weekly Tracker */}
      <WeeklyWorkoutTracker weeklyGoal={4} />

      {/* Heatmap */}
      <WorkoutHeatmap />

      {/* Achievements */}
      <AchievementsBadges />

    </div>
  );
}
