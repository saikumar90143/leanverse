'use client';

import React, { useEffect, useState } from 'react';
import { Users, Dumbbell, Apple, FileText, CreditCard, TrendingUp, DollarSign, Eye, Activity, UserPlus } from 'lucide-react';

interface Stats {
 kpis: {
 totalUsers: number;
 newUsersToday: number;
 activeToday: number;
 premiumUsers: number;
 totalBlogs: number;
 publishedBlogs: number;
 totalWorkoutPlans: number;
 totalDietPlans: number;
 monthlyRevenue: number;
 adRevenue: number;
 };
 charts: {
 userGrowth: { date: string; count: number }[];
 workoutGrowth: { date: string; count: number }[];
 dietGrowth: { date: string; count: number }[];
 blogByCategory: { _id: string; count: number; views: number }[];
 };
 recentUsers: { _id: string; name: string; email: string; tier: string; streak: number; createdAt: string }[];
}

// SVG Sparkline Chart
function Sparkline({ data, color = '#10b981', height = 48 }: { data: number[]; color?: string; height?: number }) {
 if (!data || data.length < 2) return null;
 const max = Math.max(...data, 1);
 const w = 160;
 const h = height;
 const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ');
 const areaPoints = `0,${h} ${pts} ${w},${h}`;
 return (
 <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full">
 <defs>
 <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor={color} stopOpacity="0.3" />
 <stop offset="100%" stopColor={color} stopOpacity="0" />
 </linearGradient>
 </defs>
 <polygon points={areaPoints} fill={`url(#sg-${color.replace('#', '')})`} />
 <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 );
}

function KpiCard({ label, value, sub, icon: Icon, color, sparkData }: {
 label: string; value: string | number; sub?: string;
 icon: React.ElementType; color: string; sparkData?: number[];
}) {
 return (
 <div className="glass rounded-2xl p-5 border border-border/10 dark:border-border relative overflow-hidden flex flex-col justify-between min-h-[110px]">
 <div className="flex items-start justify-between mb-2">
 <div>
 <p className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</p>
 <p className="text-2xl font-black text-foreground mt-1">{value}</p>
 {sub && <p className="text-[10px] text-muted mt-0.5">{sub}</p>}
 </div>
 <div className={`p-2.5 rounded-xl ${color}`}>
 <Icon className="w-4 h-4" />
 </div>
 </div>
 {sparkData && (
 <div className="h-10 mt-2 opacity-80">
 <Sparkline data={sparkData} color={color.includes('emerald') ? '#10b981' : color.includes('cyan') ? '#06b6d4' : color.includes('amber') ? '#f59e0b' : color.includes('rose') ? '#f43f5e' : '#8b5cf6'} height={40} />
 </div>
 )}
 </div>
 );
}

const tierColors: Record<string, string> = {
 free: 'bg-background0/10 text-muted',
 premium: 'bg-amber-500/10 text-amber-500',
 pro: 'bg-emerald-500/10 text-emerald-500',
};

export default function OverviewSection() {
 const [stats, setStats] = useState<Stats | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetch('/api/admin/stats')
 .then((r) => r.json())
 .then((d) => {
 setStats(d);
 setLoading(false);
 })
 .catch(() => setLoading(false));
 }, []);

 const growthNums = stats?.charts?.userGrowth?.map((d: any) => d.count) || [];
 const workoutGrowthNums = stats?.charts?.workoutGrowth?.map((d: any) => d.count) || [];
 const dietGrowthNums = stats?.charts?.dietGrowth?.map((d: any) => d.count) || [];

 if (loading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
 </div>
 );
 }

 const kpi = stats?.kpis;

 return (
 <div className="space-y-6">
 {/* KPI Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
 <KpiCard label="Total Users" value={kpi?.totalUsers?.toLocaleString() ?? '—'} icon={Users} color="bg-emerald-500/10 text-emerald-500" sparkData={growthNums} />
 <KpiCard label="Active Today" value={kpi?.activeToday?.toLocaleString() ?? '—'} sub="Unique sessions" icon={Activity} color="bg-cyan-500/10 text-cyan-500" />
 <KpiCard label="New Today" value={kpi?.newUsersToday ?? '—'} icon={UserPlus} color="bg-violet-500/10 text-violet-500" />
 <KpiCard label="Premium Users" value={kpi?.premiumUsers?.toLocaleString() ?? '—'} icon={CreditCard} color="bg-amber-500/10 text-amber-500" />
 <KpiCard label="Blog Posts" value={kpi?.totalBlogs ?? '—'} sub={`${kpi?.publishedBlogs ?? 0} published`} icon={FileText} color="bg-blue-500/10 text-blue-500" />
 <KpiCard label="Workout Plans" value={kpi?.totalWorkoutPlans?.toLocaleString() ?? '—'} icon={Dumbbell} color="bg-rose-500/10 text-rose-500" sparkData={workoutGrowthNums} />
 <KpiCard label="Diet Plans" value={kpi?.totalDietPlans?.toLocaleString() ?? '—'} icon={Apple} color="bg-green-500/10 text-green-500" sparkData={dietGrowthNums} />
 <KpiCard label="Monthly Revenue" value={`₹${(kpi?.monthlyRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="bg-emerald-500/10 text-emerald-500" />
 <KpiCard label="Ad Revenue" value={`₹${(kpi?.adRevenue ?? 0).toLocaleString()}`} sub="Est. monthly" icon={TrendingUp} color="bg-orange-500/10 text-orange-500" />
 <KpiCard label="Views" value={stats?.charts?.blogByCategory?.reduce((a, b) => a + b.views, 0).toLocaleString() ?? '0'} icon={Eye} color="bg-pink-500/10 text-pink-500" />
 </div>

 {/* Charts Row */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* User Growth Chart */}
 <div className="glass rounded-2xl p-5 border border-border/10 dark:border-border">
 <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4">User Growth (Last 7 Days)</h3>
 <div className="flex items-end gap-1.5 h-28">
 {(stats?.charts?.userGrowth ?? []).map((d: any, i: number) => {
 const max = Math.max(...(stats?.charts?.userGrowth ?? []).map((x: any) => x.count), 1);
 const pct = Math.max(((d as any).count / max) * 100, 4);
 return (
 <div key={i} className="flex-1 flex flex-col items-center gap-1">
 <div
 className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all hover:from-emerald-500 hover:to-emerald-300"
 style={{ height: `${pct}%` }}
 />
 <span className="text-[8px] text-muted ">{((d as any).date ?? '').slice(5)}</span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Blog Category Breakdown */}
 <div className="glass rounded-2xl p-5 border border-border/10 dark:border-border">
 <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4">Blog Views by Category</h3>
 <div className="space-y-3">
 {(stats?.charts?.blogByCategory ?? []).map((cat: any, i: number) => {
 const maxViews = Math.max(...(stats?.charts?.blogByCategory?.map((c: any) => c.views) ?? [1]), 1);
 const pct = ((cat.views || 0) / maxViews) * 100;
 const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];
 return (
 <div key={i} className="space-y-1">
 <div className="flex justify-between text-[10px] font-bold">
 <span className="text-muted ">{cat._id}</span>
 <span className="text-muted">{cat.views?.toLocaleString() ?? 0} views</span>
 </div>
 <div className="h-2 bg-secondary/40 dark:bg-card/5 rounded-full overflow-hidden">
 <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Recent Registrations */}
 <div className="glass rounded-2xl p-5 border border-border/10 dark:border-border">
 <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4">Recent Registrations</h3>
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="border-b border-border/10 dark:border-border">
 <th className="text-left pb-2 font-black text-muted ">User</th>
 <th className="text-left pb-2 font-black text-muted ">Email</th>
 <th className="text-left pb-2 font-black text-muted ">Tier</th>
 <th className="text-left pb-2 font-black text-muted ">Streak</th>
 <th className="text-left pb-2 font-black text-muted ">Joined</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
 {(stats?.recentUsers ?? []).map((u) => (
 <tr key={(u as any)._id} className="hover:bg-background/30 dark:hover:bg-card/3">
 <td className="py-2.5 font-bold text-foreground ">{u.name}</td>
 <td className="py-2.5 text-muted">{u.email}</td>
 <td className="py-2.5">
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${tierColors[u.tier]}`}>{u.tier}</span>
 </td>
 <td className="py-2.5 text-emerald-500 font-bold">🔥 {u.streak}d</td>
 <td className="py-2.5 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
