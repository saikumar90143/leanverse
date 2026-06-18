'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { getWeeklyGoalProgress } from '@/lib/gamification';

interface WeeklyWorkoutTrackerProps {
  weeklyGoal?: number;
  restDays?: number[]; // 0=Mon, 1=Tue... 6=Sun indices that are planned rest days
}

export default function WeeklyWorkoutTracker({ weeklyGoal = 4, restDays = [] }: WeeklyWorkoutTrackerProps) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ReturnType<typeof getWeeklyGoalProgress> | null>(null);

  useEffect(() => {
    setData(getWeeklyGoalProgress(weeklyGoal));
    setMounted(true);
  }, [weeklyGoal]);

  if (!mounted || !data) {
    return (
      <div className="glass rounded-3xl border border-border/10 p-6 animate-pulse">
        <div className="h-24 bg-secondary/30 rounded-2xl" />
      </div>
    );
  }

  const getDayStatus = (day: typeof data.days[0], index: number) => {
    if (day.hasWorkout) return 'completed';
    if (day.isLoggedRestDay) return 'rest';
    if (restDays.includes(index)) return 'rest';
    if (day.isFuture) return 'upcoming';
    return 'missed';
  };

  const statusConfig = {
    completed: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-500',
      text: 'text-white',
      icon: '🟢',
      label: 'Done',
      glow: 'shadow-emerald-500/30 shadow-lg',
    },
    rest: {
      bg: 'bg-amber-500',
      border: 'border-amber-500',
      text: 'text-white',
      icon: '🟠',
      label: 'Rest',
      glow: 'shadow-amber-500/20',
    },
    upcoming: {
      bg: 'bg-secondary',
      border: 'border-border/20',
      text: 'text-muted',
      icon: '⚪',
      label: 'Soon',
      glow: '',
    },
    missed: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/40',
      text: 'text-red-500',
      icon: '🔴',
      label: 'Miss',
      glow: '',
    },
  };

  const todayIndex = data.days.findIndex(d => d.isToday);

  return (
    <div className="glass rounded-3xl border border-border/10 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Weekly Tracker</h3>
          <p className="text-xs text-muted font-bold mt-0.5">Current Week Progress</p>
        </div>
        <div className="text-right">
          <span className={`text-xl font-black ${data.completed >= data.goal ? 'text-emerald-500' : 'text-foreground'}`}>
            {data.completed}/{data.goal}
          </span>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Completed</p>
        </div>
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-2">
        {data.days.map((day, i) => {
          const status = getDayStatus(day, i);
          const cfg = statusConfig[status];
          const isToday = day.isToday;

          return (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              {/* Day label */}
              <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-emerald-500' : 'text-muted'}`}>
                {day.dayName}
              </span>

              {/* Status circle */}
              <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${cfg.bg} ${cfg.border} ${cfg.glow} ${isToday ? 'ring-2 ring-offset-2 ring-offset-background ring-emerald-500/50 scale-110' : ''}`}>
                {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                {status === 'missed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                {status === 'upcoming' && <Clock className="w-3.5 h-3.5 text-muted" />}
                {status === 'rest' && <span className="text-xs">😴</span>}

                {/* Today pulse ring */}
                {isToday && (
                  <span className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-emerald-500" />
                )}
              </div>

              {/* Status label */}
              <span className={`text-[9px] font-black uppercase tracking-widest ${cfg.text === 'text-white' ? 'text-muted' : cfg.text}`}>
                {isToday ? 'Today' : cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-muted">Weekly Goal Progress</span>
          <span className={data.completed >= data.goal ? 'text-emerald-500' : 'text-foreground'}>
            {Math.min(data.percentage, 100)}%
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              data.completed >= data.goal
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${Math.min(data.percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Completed</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Rest Day</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-secondary border border-border/20 inline-block" /> Upcoming</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500/40 inline-block" /> Missed</span>
      </div>
    </div>
  );
}
