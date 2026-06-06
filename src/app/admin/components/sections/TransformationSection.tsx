'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Save, CheckCircle, Sliders, Zap, RefreshCw } from 'lucide-react';

interface TransformRules {
 beginnerToIntermediateDays: number;
 intermediateToAdvancedDays: number;
 cardioFrequencyBeginner: number;
 cardioFrequencyIntermediate: number;
 cardioFrequencyAdvanced: number;
 restDaysPerWeek: number;
 deloadWeekFrequency: number;
 progressiveOverloadIncrementPercent: number;
}

const defaultRules: TransformRules = {
 beginnerToIntermediateDays: 30,
 intermediateToAdvancedDays: 60,
 cardioFrequencyBeginner: 2,
 cardioFrequencyIntermediate: 3,
 cardioFrequencyAdvanced: 4,
 restDaysPerWeek: 1,
 deloadWeekFrequency: 4,
 progressiveOverloadIncrementPercent: 5,
};

const rulesMeta: { key: keyof TransformRules; label: string; desc: string; min: number; max: number; unit: string }[] = [
 { key: 'beginnerToIntermediateDays', label: 'Beginner → Intermediate (Days)', desc: 'After this many days, beginner users progress to intermediate workouts', min: 14, max: 90, unit: 'days' },
 { key: 'intermediateToAdvancedDays', label: 'Intermediate → Advanced (Days)', desc: 'After this many days, intermediate users progress to advanced workouts', min: 30, max: 180, unit: 'days' },
 { key: 'cardioFrequencyBeginner', label: 'Cardio Days/Week (Beginner)', desc: 'Number of cardio sessions per week for beginners', min: 1, max: 5, unit: 'days/week' },
 { key: 'cardioFrequencyIntermediate', label: 'Cardio Days/Week (Intermediate)', desc: 'Number of cardio sessions per week for intermediate users', min: 1, max: 6, unit: 'days/week' },
 { key: 'cardioFrequencyAdvanced', label: 'Cardio Days/Week (Advanced)', desc: 'Number of cardio sessions per week for advanced users', min: 2, max: 7, unit: 'days/week' },
 { key: 'restDaysPerWeek', label: 'Rest Days Per Week', desc: 'Minimum rest days built into every weekly schedule', min: 0, max: 3, unit: 'days' },
 { key: 'deloadWeekFrequency', label: 'Deload Every N Weeks', desc: 'Every N weeks, a deload (reduced intensity) week is scheduled', min: 2, max: 12, unit: 'weeks' },
 { key: 'progressiveOverloadIncrementPercent', label: 'Progressive Overload Increment', desc: 'Percentage weight increase applied each week for progressive overload', min: 2, max: 15, unit: '%' },
];

export default function TransformationSection() {
 const [rules, setRules] = useState<TransformRules>(defaultRules);
 const [leaderboard, setLeaderboard] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [saved, setSaved] = useState(false);

 const fetchRulesAndLeaderboard = useCallback(async () => {
 try {
 const [resSettings, resLeaderboard] = await Promise.all([
 fetch('/api/admin/settings'),
 fetch('/api/admin/leaderboard')
 ]);
 const dataSettings = await resSettings.json();
 const dataLeaderboard = await resLeaderboard.json();
 
 if (dataSettings.settings?.transformationRules) {
 setRules({ ...defaultRules, ...dataSettings.settings.transformationRules });
 }
 if (dataLeaderboard.leaderboard) {
 setLeaderboard(dataLeaderboard.leaderboard);
 }
 } catch (e) {
 console.error(e);
 }
 setLoading(false);
 }, []);

 useEffect(() => { fetchRulesAndLeaderboard(); }, [fetchRulesAndLeaderboard]);

 const save = async () => {
 setSaving(true);
 try {
 await fetch('/api/admin/settings', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ transformationRules: rules }),
 });
 setSaved(true);
 setTimeout(() => setSaved(false), 2000);
 } catch {}
 setSaving(false);
 };

 return (
 <div className="space-y-6">
 {/* Leaderboard */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border">
 <h3 className="font-black text-foreground text-sm mb-4 flex items-center gap-2">
 <span>🏆</span> Top Performers Leaderboard
 </h3>
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="border-b border-border/10 dark:border-border">
 <th className="text-left pb-2 font-black text-muted">#</th>
 <th className="text-left pb-2 font-black text-muted">User</th>
 <th className="text-left pb-2 font-black text-muted">Streak</th>
 <th className="text-left pb-2 font-black text-muted">Workouts</th>
 <th className="text-left pb-2 font-black text-muted">Weight Lost</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
 {leaderboard.map((u) => (
 <tr key={u.rank} className={u.rank <= 3 ? 'font-bold' : ''}>
 <td className="py-2.5">
 <span className={`text-sm ${u.rank === 1 ? 'text-amber-400' : u.rank === 2 ? 'text-slate-300' : u.rank === 3 ? 'text-orange-400' : 'text-muted'}`}>
 {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : `#${u.rank}`}
 </span>
 </td>
 <td className="py-2.5 text-foreground ">{u.name}</td>
 <td className="py-2.5 text-emerald-500">🔥 {u.streak}d</td>
 <td className="py-2.5 text-muted">{u.workouts}</td>
 <td className="py-2.5 text-cyan-500">-{u.weightLost} kg</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Transformation Control Center */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-5">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
 <Sliders className="w-5 h-5" />
 </div>
 <div>
 <h3 className="font-black text-foreground">Transformation Control Center</h3>
 <p className="text-xs text-muted">Edit workout engine rules without touching code</p>
 </div>
 </div>
 <div className="flex gap-2">
 <button onClick={() => setRules(defaultRules)} className="flex items-center gap-1.5 px-3 py-2 bg-secondary dark:bg-card/5 text-muted rounded-xl text-xs font-bold hover:bg-secondary dark:hover:bg-card/10 transition-all">
 <RefreshCw className="w-3.5 h-3.5" /> Reset
 </button>
 <button onClick={save} disabled={saving}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'}`}>
 {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
 {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Rules'}
 </button>
 </div>
 </div>

 {loading ? (
 <div className="flex items-center justify-center h-32">
 <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 {rulesMeta.map(({ key, label, desc, min, max, unit }) => (
 <div key={key} className="bg-secondary/30 dark:bg-card/3 rounded-2xl p-4 border border-border/10 dark:border-border space-y-3">
 <div>
 <p className="font-bold text-foreground text-sm">{label}</p>
 <p className="text-[10px] text-muted">{desc}</p>
 </div>
 <div className="flex items-center gap-3">
 <input
 type="range"
 min={min}
 max={max}
 value={rules[key]}
 onChange={(e) => setRules(r => ({ ...r, [key]: parseInt(e.target.value) }))}
 className="flex-1 h-1.5 accent-emerald-500"
 />
 <div className="min-w-16 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
 <span className="text-xs font-black text-emerald-500">{rules[key]} {unit}</span>
 </div>
 </div>
 <div className="flex justify-between text-[9px] text-muted">
 <span>{min} {unit}</span>
 <span>{max} {unit}</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
