'use client';

import React, { useEffect, useState } from 'react';
import { getStreak, getLifetimeVolume, getUserLevel, getLevelProgress } from '@/lib/gamification';
import { Flame, Zap } from 'lucide-react';

interface StreakData {
  streak: number;
  level: ReturnType<typeof getUserLevel>;
  progress: number;
  lifetimeVol: number;
}

/**
 * StreakBadge — Displays the user's current workout streak and level.
 * Reads from localStorage on mount. Refresh-safe (reads fresh data each render).
 */
export default function StreakBadge() {
  const [data, setData] = useState<StreakData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const vol = getLifetimeVolume();
      const streak = getStreak();
      const level = getUserLevel(vol);
      const progress = getLevelProgress(vol);
      setData({ streak, level, progress, lifetimeVol: vol });
    } catch {
      // localStorage unavailable (private mode, etc.) — render nothing
      setData(null);
    }
  }, []);

  // Don't render on SSR or if data couldn't be read
  if (!mounted || !data) return null;

  const { streak, level, progress, lifetimeVol } = data;

  const isOnFire = streak >= 3;
  const isMaxLevel = level.maxVolume === null;
  const nextLevelVolume = isMaxLevel ? null : level.maxVolume!;
  const volumeToNext = nextLevelVolume !== null ? nextLevelVolume - lifetimeVol : 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Streak Badge */}
      <div
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-black transition-all ${
          streak === 0
            ? 'bg-slate-100/50 dark:bg-white/5 border-slate-300/20 text-slate-400'
            : isOnFire
            ? 'bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-orange-500/10 shadow-lg'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
        }`}
        title={`${streak}-day workout streak`}
      >
        <Flame
          className={`w-3.5 h-3.5 ${streak > 0 && isOnFire ? 'animate-pulse' : ''}`}
        />
        <span>{streak > 0 ? `${streak} Day Streak` : 'Start Your Streak!'}</span>
      </div>

      {/* Level Badge */}
      <div
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-black ${level.bgColor} ${level.borderColor} ${level.color}`}
        title={
          isMaxLevel
            ? `${level.name} — Maximum Level!`
            : `${level.name} — ${volumeToNext.toLocaleString()}kg to next level`
        }
      >
        <span className="text-sm leading-none">{level.emoji}</span>
        <span>{level.name}</span>

        {/* Progress mini-bar */}
        {!isMaxLevel && (
          <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden ml-1">
            <div
              className="h-full rounded-full bg-current opacity-80 transition-all duration-700"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}

        {isMaxLevel && <Zap className="w-3 h-3 animate-pulse" />}
      </div>
    </div>
  );
}
