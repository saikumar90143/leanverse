'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, UserCheck, Repeat, DollarSign, Lightbulb, ArrowUpRight } from 'lucide-react';

const aiInsights = [
 { type: 'warning', icon: '📉', text: 'Most users are dropping off after Day 7 of their transformation. Consider adding a motivational push notification on Day 5.' },
 { type: 'tip', icon: '✍️', text: 'Publish more fat loss content. It has 3x more search volume than muscle gain in your current audience segment.' },
 { type: 'tip', icon: '🏋️', text: 'Add more beginner workout plans — 68% of new signups select "Beginner" in the quick start wizard.' },
 { type: 'success', icon: '🚀', text: 'Indian diet plan blogs are generating the highest ad revenue per page. Consider creating more Indian meal prep articles.' },
 { type: 'warning', icon: '💤', text: 'User engagement drops sharply on Sundays. Schedule blog publishing and notifications for weekdays.' },
 { type: 'tip', icon: '🏆', text: 'Users with 10+ day streaks have a 4x higher chance of upgrading to Premium. Consider showing upgrade prompts on streak milestones.' },
];

const insightColors: Record<string, string> = {
 warning: 'border-amber-500/20 bg-amber-500/5',
 tip: 'border-blue-500/20 bg-blue-500/5',
 success: 'border-emerald-500/20 bg-emerald-500/5',
};

const insightTextColors: Record<string, string> = {
 warning: 'text-amber-600 dark:text-amber-400',
 tip: 'text-blue-600 dark:text-blue-400',
 success: 'text-emerald-600 dark:text-emerald-400',
};

export default function GrowthSection() {
 const [data, setData] = useState<{ dau: number; mau: number; totalUsers: number; growth: { date: string; newUsers: number }[]; retention: number[]; kpiChanges: any } | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetch('/api/admin/growth')
 .then(r => r.json())
 .then(d => {
 setData(d);
 setLoading(false);
 })
 .catch(() => setLoading(false));
 }, []);

 const dau = data?.dau || 0;
 const mau = data?.mau || 0;
 const growth = data?.growth || [];
 const retentionData = data?.retention || [0, 0, 0, 0, 0, 0, 0, 0];
 const kpis = data?.kpiChanges || {
   dau: { value: '0%', up: true },
   mau: { value: '0%', up: true },
   retention: { value: '0%', up: true },
   conversion: { value: '0%', up: true },
   mrr: { value: '0%', up: true },
   churn: { value: '0%', up: true },
 };

 const metrics = [
   { label: 'DAU', value: dau.toLocaleString(), change: kpis.dau.value, up: kpis.dau.up, icon: Users, color: 'text-emerald-500 bg-emerald-500/10' },
   { label: 'MAU', value: mau.toLocaleString(), change: kpis.mau.value, up: kpis.mau.up, icon: UserCheck, color: 'text-cyan-500 bg-cyan-500/10' },
   { label: 'Retention D7', value: `${retentionData[7]}%`, change: kpis.retention.value, up: kpis.retention.up, icon: Repeat, color: 'text-violet-500 bg-violet-500/10' },
   { label: 'Conversion Rate', value: '0%', change: kpis.conversion.value, up: kpis.conversion.up, icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10' },
   { label: 'Premium MRR', value: '₹0', change: kpis.mrr.value, up: kpis.mrr.up, icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
   { label: 'Churn Rate', value: '0%', change: kpis.churn.value, up: kpis.churn.up, icon: Repeat, color: 'text-rose-500 bg-rose-500/10' },
 ];

 if (loading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* KPI Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
 {metrics.map((m) => (
 <div key={m.label} className="glass rounded-2xl p-5 border border-border/10 dark:border-border">
 <div className="flex items-center justify-between mb-2">
 <div className={`p-2 rounded-xl ${m.color}`}><m.icon className="w-4 h-4" /></div>
 <span className={`text-[10px] font-black flex items-center gap-0.5 ${m.up ? 'text-emerald-500' : 'text-rose-500'}`}>
 <ArrowUpRight className={`w-3 h-3 ${!m.up ? 'rotate-180' : ''}`} />
 {m.change}
 </span>
 </div>
 <p className="text-[10px] font-black text-muted uppercase tracking-widest">{m.label}</p>
 <p className="text-2xl font-black text-foreground mt-0.5">{m.value}</p>
 </div>
 ))}
 </div>

 {/* Charts */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {[
 { label: 'User Growth (Last 30 Days)', data: growth.map(g => g.newUsers), color: '#10b981' },
 { label: 'Cumulative Users', data: growth.map((g, i) => growth.slice(0, i + 1).reduce((sum, curr) => sum + curr.newUsers, data?.totalUsers ? data.totalUsers - growth.reduce((a,b)=>a+b.newUsers,0) : 0)), color: '#06b6d4' },
 ].map(({ label, data: chartData, color }) => {
 const max = Math.max(...(chartData.length ? chartData : [1]));
 return (
 <div key={label} className="glass rounded-2xl p-5 border border-border/10 dark:border-border">
 <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4">{label}</h3>
 <div className="flex items-end gap-1.5 h-28">
 {chartData.map((v, i) => (
 <div key={i} className="flex-1 flex flex-col items-center gap-1">
 <div
 className="w-full rounded-t-md transition-all hover:opacity-80"
 style={{ height: `${(v / max) * 100}%`, backgroundColor: color }}
 />
 </div>
 ))}
 </div>
 <div className="flex justify-between mt-2 text-[10px] text-muted font-bold">
 <span>Min: {Math.min(...(chartData.length ? chartData : [0])).toLocaleString()}</span>
 <span>Max: {max.toLocaleString()}</span>
 </div>
 </div>
 );
 })}
 </div>

 {/* User Retention Heatmap (simplified) */}
 <div className="glass rounded-2xl p-5 border border-border/10 dark:border-border">
 <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4">Retention by Day (Cohort Week 1)</h3>
 <div className="grid grid-cols-8 gap-1.5">
 {['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'].map((d) => (
 <div key={d} className="text-center">
 <p className="text-[9px] text-muted mb-1">{d}</p>
 </div>
 ))}
 {retentionData.map((v, i) => (
 <div key={i} className="rounded-lg p-2 text-center text-[10px] font-black"
 style={{ backgroundColor: `rgba(16, 185, 129, ${v / 120})`, color: v > 50 ? '#fff' : '#10b981' }}>
 {v}%
 </div>
 ))}
 </div>
 </div>

 {/* AI Growth Insights */}
 <div className="glass rounded-2xl p-5 border border-border/10 dark:border-border space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
 <Lightbulb className="w-4 h-4" />
 </div>
 <div>
 <h3 className="font-black text-foreground text-sm">AI Growth Insights</h3>
 <p className="text-[10px] text-muted">AI-powered recommendations to grow your platform</p>
 </div>
 </div>
 <div className="space-y-3">
 {aiInsights.map((insight, i) => (
 <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl border ${insightColors[insight.type]}`}>
 <span className="text-lg shrink-0">{insight.icon}</span>
 <p className={`text-xs font-medium leading-relaxed ${insightTextColors[insight.type]}`}>{insight.text}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}
