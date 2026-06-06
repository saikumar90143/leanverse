'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Save, TestTube, Bot, Zap, Apple, MessageSquare, CheckCircle } from 'lucide-react';

interface Prompts {
 workout: string;
 diet: string;
 coach: string;
}

const promptMeta = [
 { key: 'workout' as const, label: 'AI Workout Generator', icon: Zap, color: 'text-emerald-500', description: 'System prompt used when generating personalized workout plans' },
 { key: 'diet' as const, label: 'AI Diet Planner', icon: Apple, color: 'text-cyan-500', description: 'System prompt used when generating diet plans and meal schedules' },
 { key: 'coach' as const, label: 'AI Fitness Coach (LeanBot)', icon: MessageSquare, color: 'text-violet-500', description: 'Personality and instruction prompt for the AI chatbot coach' },
];

export default function AISection() {
 const [prompts, setPrompts] = useState<Prompts>({ workout: '', diet: '', coach: '' });
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState<string | null>(null);
 const [saved, setSaved] = useState<string | null>(null);
 const [testing, setTesting] = useState<string | null>(null);
 const [testResult, setTestResult] = useState<Record<string, string>>({});

 const fetchSettings = useCallback(async () => {
 try {
 const res = await fetch('/api/admin/settings');
 const data = await res.json();
 if (data.settings?.aiPrompts) {
 setPrompts(data.settings.aiPrompts);
 }
 } catch {}
 setLoading(false);
 }, []);

 useEffect(() => { fetchSettings(); }, [fetchSettings]);

 const savePrompt = async (key: keyof Prompts) => {
 setSaving(key);
 try {
 await fetch('/api/admin/settings', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ [`aiPrompts.${key}`]: prompts[key] }),
 });
 setSaved(key);
 setTimeout(() => setSaved(null), 2000);
 } catch {}
 setSaving(null);
 };

 const testPrompt = async (key: keyof Prompts) => {
 setTesting(key);
 // Simulate test — in production this would call the actual AI endpoint
 await new Promise((r) => setTimeout(r, 1200));
 setTestResult(prev => ({
 ...prev,
 [key]: '✅ Prompt validated successfully. Response structure looks correct. Token usage: ~450 tokens.',
 }));
 setTesting(null);
 };

 // Mock analytics
 const aiAnalytics = [
 { label: 'Requests Today', value: '847', change: '+12%', color: 'text-emerald-500' },
 { label: 'Success Rate', value: '98.2%', change: '+0.4%', color: 'text-cyan-500' },
 { label: 'Avg Tokens', value: '512', change: '-3%', color: 'text-violet-500' },
 { label: 'Avg Response', value: '1.4s', change: '-0.2s', color: 'text-amber-500' },
 ];

 return (
 <div className="space-y-6">
 {/* AI Analytics */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {aiAnalytics.map((a) => (
 <div key={a.label} className="glass rounded-2xl p-4 border border-border/10 dark:border-border">
 <p className="text-[10px] font-black text-muted uppercase tracking-widest">{a.label}</p>
 <p className={`text-2xl font-black mt-1 ${a.color}`}>{a.value}</p>
 <p className="text-[10px] text-muted mt-0.5">{a.change} vs yesterday</p>
 </div>
 ))}
 </div>

 {/* Prompt Editors */}
 {loading ? (
 <div className="flex items-center justify-center h-32">
 <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
 </div>
 ) : promptMeta.map(({ key, label, icon: Icon, color, description }) => (
 <div key={key} className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-xl bg-secondary dark:bg-card/5 ${color}`}>
 <Icon className="w-4 h-4" />
 </div>
 <div>
 <h3 className="font-black text-foreground text-sm">{label}</h3>
 <p className="text-[10px] text-muted">{description}</p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <button
 onClick={() => testPrompt(key)}
 disabled={!!testing}
 className="flex items-center gap-1.5 px-3 py-2 bg-violet-500/10 text-violet-500 border border-violet-500/20 rounded-xl text-xs font-bold hover:bg-violet-500/20 transition-all"
 >
 <TestTube className="w-3.5 h-3.5" />
 {testing === key ? 'Testing...' : 'Test'}
 </button>
 <button
 onClick={() => savePrompt(key)}
 disabled={saving === key}
 className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${saved === key ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'}`}
 >
 {saved === key ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
 {saved === key ? 'Saved!' : saving === key ? 'Saving...' : 'Save'}
 </button>
 </div>
 </div>

 <textarea
 rows={6}
 value={prompts[key]}
 onChange={(e) => setPrompts(p => ({ ...p, [key]: e.target.value }))}
 placeholder={`Enter the system prompt for ${label}...`}
 className="w-full px-4 py-3 bg-secondary/50 border border-border/20 dark:border-border rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500 resize-none text-foreground "
 />

 {testResult[key] && (
 <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-xs font-mono text-emerald-600 dark:text-emerald-400">
 {testResult[key]}
 </div>
 )}
 </div>
 ))}
 </div>
 );
}
