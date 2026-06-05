'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Zap, Clock, Target, BarChart3 } from 'lucide-react';

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-500',
  Intermediate: 'bg-amber-500/10 text-amber-500',
  Advanced: 'bg-rose-500/10 text-rose-500',
};

export default function WorkoutsSection() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/workouts')
      .then(r => r.json())
      .then(data => {
        if (data.programs) setPrograms(data.programs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Programs', value: programs.length, icon: Dumbbell, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Active Users', value: '2,960', icon: Zap, color: 'text-cyan-500 bg-cyan-500/10' },
          { label: 'Avg Completion', value: '51%', icon: Target, color: 'text-violet-500 bg-violet-500/10' },
          { label: 'Avg Duration', value: '75 days', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-slate-200/10 dark:border-white/5 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold">{s.label}</p>
              <p className="text-xl font-black text-slate-800 dark:text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Programs Table */}
      <div className="glass rounded-2xl border border-slate-200/10 dark:border-white/5 overflow-hidden">
        <div className="p-5 border-b border-slate-200/10 dark:border-white/5 flex items-center justify-between">
          <h3 className="font-black text-slate-800 dark:text-white text-sm">Transformation Programs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200/10 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                <th className="text-left px-4 py-3 font-black text-slate-400">Program</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Level</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Goal</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Duration</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Active Users</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
              {programs.map((p) => (
                <tr key={p.name} className="hover:bg-slate-50/30 dark:hover:bg-white/3">
                  <td className="px-4 py-3 font-bold text-slate-700 dark:text-zinc-200">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${levelColors[p.level] || 'bg-slate-500/10 text-slate-500'}`}>{p.level}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.goal}</td>
                  <td className="px-4 py-3 text-slate-500">{p.durationDays} days</td>
                  <td className="px-4 py-3 text-slate-500">{(p.activeUsers || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200/40 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.completionRate || 0}%` }} />
                      </div>
                      <span className="text-emerald-500 font-bold">{p.completionRate || 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-200/10 dark:border-white/5 text-center">
        <BarChart3 className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
        <p className="font-bold text-slate-500 dark:text-zinc-400">Full workout builder with drag & drop exercise assignment is coming in the next update.</p>
      </div>
    </div>
  );
}
