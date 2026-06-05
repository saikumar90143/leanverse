'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MessageSquare, ChevronDown, Filter, Edit2, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface Ticket {
  _id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  resolution: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  open: { label: 'Open', icon: MessageSquare, color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  resolved: { label: 'Resolved', icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  closed: { label: 'Closed', icon: XCircle, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

const priorityColors: Record<string, string> = {
  low: 'text-slate-400',
  medium: 'text-amber-500',
  high: 'text-orange-500',
  urgent: 'text-rose-500 font-black',
};

export default function SupportSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [resolution, setResolution] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/tickets?${params}`);
      const data = await res.json();
      setTickets(data.tickets || []);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const updateStatus = async (id: string, status: string, res?: string) => {
    setUpdating(true);
    try {
      await fetch('/api/admin/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, resolution: res || '' }),
      });
      await fetch_();
      setSelected(null);
    } catch {}
    setUpdating(false);
  };

  // Mock data for demo
  const mockTickets: Ticket[] = [
    { _id: '1', userName: 'Rohan', userEmail: 'rohan@demo.com', subject: 'Workout plan not generating', message: 'I clicked generate AI transformation but it keeps loading...', status: 'open', priority: 'high', category: 'Technical', resolution: '', createdAt: new Date().toISOString() },
    { _id: '2', userName: 'Priya', userEmail: 'priya@demo.com', subject: 'Billing question', message: 'I got charged twice this month for premium.', status: 'in_progress', priority: 'urgent', category: 'Billing', resolution: '', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: '3', userName: 'Arjun', userEmail: 'arjun@demo.com', subject: 'Great platform!', message: 'Really loving LeanVerse. Can we get more recipe options?', status: 'resolved', priority: 'low', category: 'General', resolution: 'Acknowledged. More recipes coming in next update.', createdAt: new Date(Date.now() - 172800000).toISOString() },
  ];

  const displayTickets = tickets.length > 0 ? tickets : mockTickets;

  const counts = {
    open: displayTickets.filter(t => t.status === 'open').length,
    in_progress: displayTickets.filter(t => t.status === 'in_progress').length,
    resolved: displayTickets.filter(t => t.status === 'resolved').length,
    closed: displayTickets.filter(t => t.status === 'closed').length,
  };

  return (
    <div className="space-y-5">
      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, { label, icon: Icon, color }]) => (
          <button key={key} onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
            className={`glass rounded-2xl p-4 border transition-all text-left ${statusFilter === key ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-200/10 dark:border-white/5'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase">{label}</span>
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-white">{counts[key as keyof typeof counts]}</p>
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="glass rounded-2xl border border-slate-200/10 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200/10 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                <th className="text-left px-4 py-3 font-black text-slate-400">User</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Subject</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Category</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Priority</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Status</th>
                <th className="text-left px-4 py-3 font-black text-slate-400">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">Loading...</td></tr>
              ) : displayTickets.map((t) => {
                const sc = statusConfig[t.status];
                return (
                  <tr key={t._id} className="hover:bg-slate-50/30 dark:hover:bg-white/3">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-700 dark:text-zinc-200">{t.userName}</p>
                      <p className="text-slate-400">{t.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600 dark:text-zinc-300 max-w-40 truncate">{t.subject}</td>
                    <td className="px-4 py-3 text-slate-400">{t.category}</td>
                    <td className={`px-4 py-3 font-bold uppercase ${priorityColors[t.priority]}`}>{t.priority}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${sc.color}`}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(t); setResolution(t.resolution); }}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-colors font-bold text-[10px]">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 h-full overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 dark:text-white">Ticket Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>
            <div className="glass rounded-2xl p-4 border border-slate-200/10 dark:border-white/5 space-y-2">
              <p className="font-black text-slate-800 dark:text-white">{selected.subject}</p>
              <p className="text-xs text-slate-400">{selected.userName} · {selected.userEmail}</p>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusConfig[selected.status].color}`}>{selected.status}</span>
            </div>
            <div className="bg-slate-100/50 dark:bg-white/5 rounded-xl p-4 text-sm text-slate-600 dark:text-zinc-300">
              {selected.message}
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Resolution / Reply</label>
              <textarea rows={4} value={resolution} onChange={(e) => setResolution(e.target.value)}
                placeholder="Write your resolution here..."
                className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-white/5 border border-slate-200/20 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none" />
            </div>
            <div className="space-y-2">
              {(['in_progress', 'resolved', 'closed'] as const).map((s) => {
                const sc = statusConfig[s];
                return (
                  <button key={s} onClick={() => updateStatus(selected._id, s, resolution)}
                    disabled={updating || selected.status === s}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 ${sc.color}`}>
                    Mark as {sc.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
