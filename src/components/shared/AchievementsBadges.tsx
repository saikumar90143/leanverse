'use client';

import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { getAchievements, Achievement } from '@/lib/gamification';

const TIER_STYLES: Record<Achievement['tier'], { border: string; bg: string; glow: string; label: string; labelBg: string }> = {
  bronze:    { border: 'border-amber-700/40',   bg: 'bg-amber-700/10',    glow: '',                              label: 'Bronze',    labelBg: 'bg-amber-700/20 text-amber-700 dark:text-amber-400' },
  silver:    { border: 'border-slate-400/40',   bg: 'bg-slate-400/10',    glow: '',                              label: 'Silver',    labelBg: 'bg-slate-400/20 text-slate-600 dark:text-slate-300' },
  gold:      { border: 'border-yellow-500/50',  bg: 'bg-yellow-500/10',   glow: 'shadow-yellow-500/20 shadow-lg', label: 'Gold',      labelBg: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' },
  platinum:  { border: 'border-cyan-400/50',    bg: 'bg-cyan-400/10',     glow: 'shadow-cyan-400/30 shadow-lg',  label: 'Platinum',  labelBg: 'bg-cyan-400/20 text-cyan-600 dark:text-cyan-400' },
  legendary: { border: 'border-emerald-500/60', bg: 'bg-emerald-500/10',  glow: 'shadow-emerald-500/40 shadow-xl', label: 'Legendary', labelBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
};

function BadgeCard({ achievement }: { achievement: Achievement }) {
  const style = TIER_STYLES[achievement.tier];

  if (!achievement.unlocked) {
    return (
      <div className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/10 bg-secondary/10 text-center opacity-40 select-none">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl grayscale">
          {achievement.emoji}
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-[1px]">
          <Lock className="w-5 h-5 text-muted" />
        </div>
        <p className="text-[10px] font-black text-muted uppercase tracking-widest line-clamp-1">{achievement.name}</p>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border ${style.border} ${style.bg} ${style.glow} text-center transition-all hover:scale-105 duration-200 cursor-default`}>
      {/* Tier badge */}
      <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${style.labelBg}`}>
        {style.label}
      </span>

      {/* Emoji */}
      <div className="w-12 h-12 rounded-2xl bg-background/50 flex items-center justify-center text-2xl mt-1 shadow-inner">
        {achievement.emoji}
      </div>

      {/* Name */}
      <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-tight">{achievement.name}</p>

      {/* Desc */}
      <p className="text-[9px] font-bold text-muted leading-tight line-clamp-2">{achievement.desc}</p>

      {/* Unlock date */}
      {achievement.unlockedDate && (
        <p className="text-[8px] text-muted/60 font-bold mt-0.5">{achievement.unlockedDate}</p>
      )}
    </div>
  );
}

export default function AchievementsBadges() {
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(getAchievements());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="glass rounded-3xl border border-border/10 p-6 animate-pulse">
        <div className="h-48 bg-secondary/30 rounded-2xl" />
      </div>
    );
  }

  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  const byTier = (tier: Achievement['tier']) => achievements.filter(a => a.tier === tier && a.unlocked);

  return (
    <div className="glass rounded-3xl border border-border/10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Achievements</h3>
          <p className="text-xs text-muted font-bold mt-0.5">{unlocked.length} / {achievements.length} Unlocked</p>
        </div>

        {/* Tier counts */}
        <div className="flex gap-2">
          {(['bronze', 'silver', 'gold', 'platinum', 'legendary'] as const).map(tier => {
            const count = byTier(tier).length;
            const style = TIER_STYLES[tier];
            return count > 0 ? (
              <span key={tier} className={`text-[10px] font-black px-2 py-0.5 rounded-full ${style.labelBg}`}>
                {count}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="space-y-1.5">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-muted font-bold text-right">
          {Math.round((unlocked.length / achievements.length) * 100)}% Complete
        </p>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Unlocked first */}
        {unlocked.map(a => <BadgeCard key={a.id} achievement={a} />)}
        {/* Locked last */}
        {locked.map(a => <BadgeCard key={a.id} achievement={a} />)}
      </div>
    </div>
  );
}
