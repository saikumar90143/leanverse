'use client';

import React, { useEffect, useState } from 'react';
import { getUserStorageKey } from '@/lib/storage';

export default function WorkoutHeatmap() {
  const [heatmapData, setHeatmapData] = useState<{ date: string; active: boolean; volume: number }[]>([]);

  useEffect(() => {
    // Read the db
    const workoutsRaw = localStorage.getItem(getUserStorageKey('leanverse_workouts_db'));
    const db = workoutsRaw ? JSON.parse(workoutsRaw) : {};
    
    const today = new Date();
    const data = [];
    
    // Determine the day of the week for today (0 = Sunday, 6 = Saturday)
    // We want the grid to end exactly on today's day of the week at the bottom of the last column.
    // Standard Github heatmaps have 7 rows (Sun-Sat).
    const todayDayOfWeek = today.getDay(); 
    
    // Generate exactly 12 full weeks + the remaining days of the current week
    const daysToGenerate = (12 * 7) + (todayDayOfWeek + 1);
    
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const entry = db[dateStr];
      let active = false;
      let volume = 0;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (entry && entry.exercises && Array.isArray(entry.exercises)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entry.exercises.forEach((ex: any) => {
          if (ex.sets && Array.isArray(ex.sets)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ex.sets.forEach((s: any) => {
              if (s.completed) {
                active = true;
                volume += (s.weight || 0) * (s.reps || 0);
              }
            });
          }
        });
      }
      
      data.push({ date: dateStr, active, volume });
    }
    
    setHeatmapData(data);
  }, []);

  const getIntensityClass = (volume: number, active: boolean) => {
    if (!active) return 'bg-slate-200/60 dark:bg-slate-800/50'; // Empty
    if (volume < 1000) return 'bg-emerald-300 dark:bg-emerald-800/80'; // Low intensity
    if (volume < 3000) return 'bg-emerald-400 dark:bg-emerald-600'; // Medium intensity
    if (volume < 6000) return 'bg-emerald-500 dark:bg-emerald-500'; // High intensity
    return 'bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] z-10 relative'; // Extreme intensity
  };

  return (
    <div className="glass rounded-3xl p-6 border border-slate-200/10 shadow-sm w-full">
      <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm mb-4">Workout Consistency Matrix</h3>
      <div className="flex flex-col overflow-x-auto pb-2 scrollbar-thin">
        <div className="grid grid-flow-col gap-1.5 auto-cols-max min-w-max" style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}>
          {heatmapData.map((day) => (
            <div 
              key={day.date} 
              title={`${day.date}: ${day.active ? `${day.volume}kg volume` : 'Rest Day'}`}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] transition-all hover:scale-125 cursor-pointer ${getIntensityClass(day.volume, day.active)}`}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-[200px] ml-auto">
          <span>Rest</span>
          <div className="flex gap-1.5 mx-2">
            <div className="w-3 h-3 rounded-[3px] bg-slate-200/60 dark:bg-slate-800/50"></div>
            <div className="w-3 h-3 rounded-[3px] bg-emerald-300 dark:bg-emerald-800/80"></div>
            <div className="w-3 h-3 rounded-[3px] bg-emerald-400 dark:bg-emerald-600"></div>
            <div className="w-3 h-3 rounded-[3px] bg-emerald-500 dark:bg-emerald-500"></div>
            <div className="w-3 h-3 rounded-[3px] bg-emerald-600 dark:bg-emerald-400"></div>
          </div>
          <span>Beast</span>
        </div>
      </div>
    </div>
  );
}
