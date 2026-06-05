'use client';

import React, { useState } from 'react';
import { BarChart3, Download, Calendar, FileText, Users, Dumbbell, Apple, TrendingUp } from 'lucide-react';

const reportTypes = [
  { id: 'users', label: 'User Report', icon: Users, desc: 'Registrations, activity, tiers, retention', color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'revenue', label: 'Revenue Report', icon: TrendingUp, desc: 'MRR, subscriptions, ad revenue, affiliates', color: 'bg-amber-500/10 text-amber-500' },
  { id: 'workouts', label: 'Workout Report', icon: Dumbbell, desc: 'Most used plans, completion rates, streaks', color: 'bg-blue-500/10 text-blue-500' },
  { id: 'diet', label: 'Diet Report', icon: Apple, desc: 'Popular foods, macro trends, plan adherence', color: 'bg-cyan-500/10 text-cyan-500' },
  { id: 'content', label: 'Content Report', icon: FileText, desc: 'Blog views, engagement, top performing posts', color: 'bg-violet-500/10 text-violet-500' },
  { id: 'growth', label: 'Growth Report', icon: BarChart3, desc: 'DAU, MAU, churn, conversion rates, NPS', color: 'bg-rose-500/10 text-rose-500' },
];

export default function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState('users');
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<{ headers: string[], rows: string[][] } | null>(null);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/reports?type=${selectedReport}&from=${dateFrom}&to=${dateTo}`);
      const data = await res.json();
      setPreview(data);
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  const exportCSV = () => {
    if (!preview) return;
    const csv = [preview.headers, ...preview.rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leanverse_${selectedReport}_report_${dateFrom}_${dateTo}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Report Type Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {reportTypes.map((r) => (
          <button
            key={r.id}
            onClick={() => { setSelectedReport(r.id); setPreview(null); }}
            className={`p-4 rounded-2xl border text-left transition-all ${selectedReport === r.id ? 'border-emerald-500/30 bg-emerald-500/5' : 'glass border-slate-200/10 dark:border-white/5 hover:border-slate-300/20 dark:hover:border-white/10'}`}
          >
            <div className={`p-2.5 rounded-xl w-fit mb-3 ${r.color}`}><r.icon className="w-4 h-4" /></div>
            <p className="font-black text-slate-800 dark:text-white text-sm">{r.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Date Range & Generate */}
      <div className="glass rounded-2xl p-6 border border-slate-200/10 dark:border-white/5 space-y-4">
        <h3 className="font-black text-slate-800 dark:text-white text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          Generate {reportTypes.find(r => r.id === selectedReport)?.label}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-zinc-800 border border-slate-200/20 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-zinc-800 border border-slate-200/20 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={generate} disabled={generating}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl text-sm disabled:opacity-50">
            {generating ? 'Generating...' : '📊 Generate Report'}
          </button>
          {preview && (
            <button onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-zinc-200 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-white/10">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Preview Table */}
      {preview && (
        <div className="glass rounded-2xl border border-slate-200/10 dark:border-white/5 overflow-hidden">
          <div className="p-4 border-b border-slate-200/10 dark:border-white/5">
            <p className="text-xs font-black text-slate-400">Report Preview · {dateFrom} to {dateTo}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200/10 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                  {preview.headers.map(h => (
                    <th key={h} className="text-left px-4 py-3 font-black text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
                {preview.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 dark:hover:bg-white/3">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-slate-600 dark:text-zinc-300 font-medium">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-center text-[10px] text-slate-400 border-t border-slate-200/10 dark:border-white/5">
            Showing preview data. Export CSV for complete results.
          </div>
        </div>
      )}
    </div>
  );
}
