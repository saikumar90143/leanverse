'use client';

import React, { useState, useEffect } from 'react';
import { getHeatmapData } from '@/lib/gamification';

type HeatmapDay = { date: string; hasWorkout: boolean; volume: number; calories: number };

function getIntensity(day: HeatmapDay): 0 | 1 | 2 | 3 {
  if (!day.hasWorkout) return 0;
  if (day.volume === 0) return 1; // bodyweight/cardio with no weight
  if (day.volume < 2000) return 2;
  return 3;
}

const INTENSITY_CLASSES = [
  'bg-secondary border-border/10',                               // 0 — none
  'bg-amber-400/40 border-amber-400/30',                        // 1 — light
  'bg-emerald-500/60 border-emerald-500/40',                    // 2 — workout
  'bg-emerald-500 border-emerald-600 shadow-sm shadow-emerald-500/30', // 3 — heavy
];

const INTENSITY_LABELS = ['No activity', 'Light activity', 'Workout completed', 'Heavy session 🔥'];

export default function WorkoutHeatmap() {
  const [mounted, setMounted] = useState(false);
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>([]);
  const [tooltip, setTooltip] = useState<{ day: HeatmapDay; x: number; y: number } | null>(null);

  useEffect(() => {
    setHeatmap(getHeatmapData(84)); // 12 weeks
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="glass rounded-3xl border border-border/10 p-6 animate-pulse">
        <div className="h-36 bg-secondary/30 rounded-2xl" />
      </div>
    );
  }

  // Build 12 columns (weeks) x 7 rows (days)
  // Pad the start so day 0 lines up with its correct weekday
  const firstDate = new Date(heatmap[0]?.date ?? new Date());
  const startDow = (firstDate.getDay() + 6) % 7; // Mon=0
  const paddedDays: (HeatmapDay | null)[] = [
    ...Array(startDow).fill(null),
    ...heatmap,
  ];
  // Fill to full weeks
  while (paddedDays.length % 7 !== 0) paddedDays.push(null);

  const weeks: (HeatmapDay | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  const totalWorkouts = heatmap.filter(d => d.hasWorkout).length;
  const todayStr = heatmap[heatmap.length - 1]?.date ?? '';

  return (
    <div className="glass rounded-3xl border border-border/10 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-foreground text-sm uppercase tracking-widest">Activity Heatmap</h3>
          <p className="text-xs text-muted font-bold mt-0.5">Last 12 Weeks</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-emerald-500">{totalWorkouts}</span>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Workouts</p>
        </div>
      </div>

      {/* Day-of-week labels */}
      <div className="relative">
        <div className="flex gap-1 mb-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="w-4 sm:w-5 text-center text-[8px] sm:text-[9px] font-black text-muted uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Grid — transposed: rows=days-of-week, cols=weeks */}
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => {
                if (!day) {
                  return <div key={di} className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm" />;
                }
                const intensity = getIntensity(day);
                const isToday = day.date === todayStr;
                return (
                  <div
                    key={di}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm border transition-all duration-200 cursor-pointer hover:scale-125 hover:z-10 relative ${INTENSITY_CLASSES[intensity]} ${isToday ? 'ring-2 ring-emerald-500 ring-offset-1 ring-offset-background' : ''}`}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ day, x: rect.left, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{ left: tooltip.x - 60, top: tooltip.y - 90 }}
          >
            <div className="glass bg-background/95 border border-border rounded-xl px-3 py-2 text-xs shadow-2xl min-w-[140px]">
              <p className="font-black text-foreground">{tooltip.day.date}</p>
              <p className="text-muted font-bold mt-0.5">{INTENSITY_LABELS[getIntensity(tooltip.day)]}</p>
              {tooltip.day.hasWorkout && (
                <>
                  <p className="text-emerald-500 font-bold">{tooltip.day.volume.toLocaleString()} kg volume</p>
                  <p className="text-amber-500 font-bold">{tooltip.day.calories} kcal burned</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-muted">
        <span>Less</span>
        {INTENSITY_CLASSES.map((cls, i) => (
          <div key={i} className={`w-4 h-4 rounded-sm border ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
