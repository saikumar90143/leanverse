'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ToggleRight, ToggleLeft, Save, DollarSign, Eye, MousePointer, TrendingUp, CheckCircle } from 'lucide-react';

interface AdSettings {
 adsEnabled: boolean;
 adPlacements: { homepage: boolean; blog: boolean; workout: boolean; calculators: boolean };
 adsenseId: string;
}

const placements = [
 { key: 'homepage' as const, label: 'Homepage', desc: 'Hero and mid-page banner slots' },
 { key: 'blog' as const, label: 'Blog Pages', desc: 'In-article and sidebar ads' },
 { key: 'workout' as const, label: 'Workout Planner', desc: 'Below the exercise cards' },
 { key: 'calculators' as const, label: 'Calculator Pages', desc: 'Result area banner' },
];

const adMetrics = [
 { label: 'Est. Monthly RPM', value: '₹42', icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
 { label: 'Page Views', value: '12.4K', icon: Eye, color: 'text-cyan-500 bg-cyan-500/10' },
 { label: 'CTR', value: '2.1%', icon: MousePointer, color: 'text-amber-500 bg-amber-500/10' },
 { label: 'Est. Earnings', value: '₹521', icon: TrendingUp, color: 'text-violet-500 bg-violet-500/10' },
];

export default function AdsSection() {
 const [settings, setSettings] = useState<AdSettings>({
 adsEnabled: true,
 adPlacements: { homepage: true, blog: true, workout: true, calculators: true },
 adsenseId: '',
 });
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [saved, setSaved] = useState(false);

 const fetchSettings = useCallback(async () => {
 try {
 const res = await fetch('/api/admin/settings');
 const data = await res.json();
 if (data.settings) {
 setSettings(s => ({
 ...s,
 adsEnabled: data.settings.adsEnabled ?? true,
 adPlacements: data.settings.adPlacements ?? s.adPlacements,
 adsenseId: data.settings.adsenseId ?? '',
 }));
 }
 } catch {}
 setLoading(false);
 }, []);

 useEffect(() => { fetchSettings(); }, [fetchSettings]);

 const save = async () => {
 setSaving(true);
 try {
 await fetch('/api/admin/settings', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 adsEnabled: settings.adsEnabled,
 adPlacements: settings.adPlacements,
 adsenseId: settings.adsenseId,
 }),
 });
 setSaved(true);
 setTimeout(() => setSaved(false), 2000);
 } catch {}
 setSaving(false);
 };

 return (
 <div className="space-y-6">
 {/* Revenue Metrics */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {adMetrics.map((m) => (
 <div key={m.label} className="glass rounded-2xl p-4 border border-border/10 dark:border-border flex items-center gap-3">
 <div className={`p-2.5 rounded-xl ${m.color}`}><m.icon className="w-4 h-4" /></div>
 <div>
 <p className="text-[10px] text-muted font-bold">{m.label}</p>
 <p className="text-xl font-black text-foreground">{m.value}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Global Toggle */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="font-black text-foreground">Global AdSense Status</h3>
 <p className="text-xs text-muted mt-0.5">Master toggle — disables all ads across the entire platform</p>
 </div>
 <button onClick={() => setSettings(s => ({ ...s, adsEnabled: !s.adsEnabled }))} className="transition-all">
 {settings.adsEnabled
 ? <ToggleRight className="w-12 h-12 text-emerald-500" />
 : <ToggleLeft className="w-12 h-12 text-muted" />}
 </button>
 </div>
 <div className={`mt-4 px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 ${settings.adsEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${settings.adsEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
 {settings.adsEnabled ? 'Ads are LIVE across the platform' : 'All ads are currently DISABLED'}
 </div>
 </div>

 {/* Per-Page Placement Control */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-4">
 <h3 className="font-black text-foreground text-sm">Placement Control</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {placements.map(({ key, label, desc }) => {
 const enabled = settings.adPlacements[key];
 return (
 <div key={key} onClick={() => setSettings(s => ({ ...s, adPlacements: { ...s.adPlacements, [key]: !enabled } }))}
 className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${enabled ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-secondary/30 dark:bg-card/3 border-border/10 dark:border-border'}`}>
 <div>
 <p className={`font-bold text-sm ${enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted '}`}>{label}</p>
 <p className="text-[10px] text-muted">{desc}</p>
 </div>
 {enabled ? <ToggleRight className="w-8 h-8 text-emerald-500 shrink-0" /> : <ToggleLeft className="w-8 h-8 text-muted shrink-0" />}
 </div>
 );
 })}
 </div>
 </div>

 {/* AdSense ID */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-3">
 <h3 className="font-black text-foreground text-sm">AdSense Publisher ID</h3>
 <input
 value={settings.adsenseId}
 onChange={(e) => setSettings(s => ({ ...s, adsenseId: e.target.value }))}
 placeholder="ca-pub-XXXXXXXXXXXXXXXX"
 className="w-full px-4 py-3 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-500"
 />
 <p className="text-[10px] text-muted">This ID is used across all ad placements. Find it in your AdSense account settings.</p>
 </div>

 <div className="flex justify-end">
 <button onClick={save} disabled={saving}
 className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400'}`}>
 {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
 {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Ad Settings'}
 </button>
 </div>
 </div>
 );
}
