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
 { label: 'Active Users', value: programs.reduce((acc, p) => acc + (p.activeUsers || 0), 0).toLocaleString(), icon: Zap, color: 'text-cyan-500 bg-cyan-500/10' },
 { label: 'Avg Completion', value: `${programs.length ? Math.round(programs.reduce((acc, p) => acc + (p.completionRate || 0), 0) / programs.length) : 0}%`, icon: Target, color: 'text-violet-500 bg-violet-500/10' },
 { label: 'Avg Duration', value: `${programs.length ? Math.round(programs.reduce((acc, p) => acc + (p.durationDays || 0), 0) / programs.length) : 0} days`, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
 ].map(s => (
 <div key={s.label} className="glass rounded-2xl p-4 border border-border/10 dark:border-border flex items-center gap-3">
 <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-4 h-4" /></div>
 <div>
 <p className="text-[10px] text-muted font-bold">{s.label}</p>
 <p className="text-xl font-black text-foreground">{s.value}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Programs Table */}
 <div className="glass rounded-2xl border border-border/10 dark:border-border overflow-hidden">
 <div className="p-5 border-b border-border/10 dark:border-border flex items-center justify-between">
 <h3 className="font-black text-foreground text-sm">Transformation Programs</h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="border-b border-border/10 dark:border-border bg-background/50 dark:bg-card/2">
 <th className="text-left px-4 py-3 font-black text-muted">Program</th>
 <th className="text-left px-4 py-3 font-black text-muted">Level</th>
 <th className="text-left px-4 py-3 font-black text-muted">Goal</th>
 <th className="text-left px-4 py-3 font-black text-muted">Duration</th>
 <th className="text-left px-4 py-3 font-black text-muted">Active Users</th>
 <th className="text-left px-4 py-3 font-black text-muted">Completion</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
 {programs.map((p) => (
 <tr key={p.name} className="hover:bg-background/30 dark:hover:bg-card/3">
 <td className="px-4 py-3 font-bold text-foreground ">{p.name}</td>
 <td className="px-4 py-3">
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${levelColors[p.level] || 'bg-background0/10 text-muted'}`}>{p.level}</span>
 </td>
 <td className="px-4 py-3 text-muted">{p.goal}</td>
 <td className="px-4 py-3 text-muted">{p.durationDays} days</td>
 <td className="px-4 py-3 text-muted">{(p.activeUsers || 0).toLocaleString()}</td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-2">
 <div className="flex-1 h-1.5 bg-secondary/40 dark:bg-card/5 rounded-full overflow-hidden">
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

 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border text-center">
 <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
 <p className="font-bold text-muted ">Full workout builder with drag & drop exercise assignment is coming in the next update.</p>
 </div>
 </div>
 );
}
