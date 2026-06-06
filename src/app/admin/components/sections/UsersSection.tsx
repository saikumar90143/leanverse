'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, UserX, ShieldCheck, Zap, Trash2, X } from 'lucide-react';

interface UserDoc {
 _id: string;
 name: string;
 email: string;
 role: string;
 tier: string;
 streak: number;
 badges: string[];
 lastActive: string;
 createdAt: string;
}

const tierColors: Record<string, string> = {
 free: 'bg-background0/10 text-muted border-slate-500/20',
 premium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
 pro: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};
const roleColors: Record<string, string> = {
 user: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
 admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function UsersSection() {
 const [users, setUsers] = useState<UserDoc[]>([]);
 const [total, setTotal] = useState(0);
 const [page, setPage] = useState(1);
 const [pages, setPages] = useState(1);
 const [search, setSearch] = useState('');
 const [tierFilter, setTierFilter] = useState('');
 const [loading, setLoading] = useState(true);
 const [selected, setSelected] = useState<UserDoc | null>(null);
 const [actionLoading, setActionLoading] = useState(false);

 const fetchUsers = useCallback(async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams({ page: String(page), limit: '15' });
 if (search) params.set('search', search);
 if (tierFilter) params.set('tier', tierFilter);
 const res = await fetch(`/api/admin/users?${params}`);
 const data = await res.json();
 setUsers(data.users || []);
 setTotal(data.total || 0);
 setPages(data.pages || 1);
 } catch {}
 setLoading(false);
 }, [page, search, tierFilter]);

 useEffect(() => { fetchUsers(); }, [fetchUsers]);

 const doAction = async (action: string, value?: string) => {
 if (!selected) return;
 setActionLoading(true);
 try {
 await fetch('/api/admin/users', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ userId: selected._id, action, value }),
 });
 await fetchUsers();
 setSelected(null);
 } catch {}
 setActionLoading(false);
 };

 const deleteUser = async (id: string) => {
 if (!confirm('Permanently delete this user?')) return;
 await fetch('/api/admin/users', {
 method: 'DELETE',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ userId: id }),
 });
 await fetchUsers();
 setSelected(null);
 };

 return (
 <div className="space-y-5">
 {/* Filters */}
 <div className="flex flex-wrap gap-3">
 <div className="relative flex-1 min-w-52">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
 <input
 type="text"
 placeholder="Search by name or email..."
 value={search}
 onChange={(e) => { setSearch(e.target.value); setPage(1); }}
 className="w-full pl-9 pr-4 py-2.5 bg-card/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
 />
 </div>
 <select
 value={tierFilter}
 onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
 className="px-3 py-2.5 bg-card/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500"
 >
 <option value="">All Tiers</option>
 <option value="free">Free</option>
 <option value="premium">Premium</option>
 <option value="pro">Pro</option>
 </select>
 <button onClick={fetchUsers} className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-colors">
 <RefreshCw className="w-4 h-4" />
 </button>
 </div>

 {/* Stats row */}
 <div className="text-xs text-muted font-bold">
 {total.toLocaleString()} users found
 </div>

 {/* Table */}
 <div className="glass rounded-2xl border border-border/10 dark:border-border overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="border-b border-border/10 dark:border-border bg-background/50 dark:bg-card/2">
 <th className="text-left px-4 py-3 font-black text-muted ">User</th>
 <th className="text-left px-4 py-3 font-black text-muted ">Role</th>
 <th className="text-left px-4 py-3 font-black text-muted ">Tier</th>
 <th className="text-left px-4 py-3 font-black text-muted ">Streak</th>
 <th className="text-left px-4 py-3 font-black text-muted ">Last Active</th>
 <th className="text-left px-4 py-3 font-black text-muted ">Joined</th>
 <th className="px-4 py-3" />
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
 {loading ? (
 <tr><td colSpan={7} className="text-center py-10 text-muted">Loading...</td></tr>
 ) : users.length === 0 ? (
 <tr><td colSpan={7} className="text-center py-10 text-muted">No users found</td></tr>
 ) : users.map((u) => (
 <tr key={u._id} className="hover:bg-background/30 dark:hover:bg-card/3 transition-colors">
 <td className="px-4 py-3">
 <div className="flex items-center gap-2.5">
 <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
 {u.name?.charAt(0)}
 </div>
 <div>
 <p className="font-bold text-foreground ">{u.name}</p>
 <p className="text-muted">{u.email}</p>
 </div>
 </div>
 </td>
 <td className="px-4 py-3">
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${roleColors[u.role]}`}>{u.role}</span>
 </td>
 <td className="px-4 py-3">
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${tierColors[u.tier]}`}>{u.tier}</span>
 </td>
 <td className="px-4 py-3 text-emerald-500 font-bold">🔥 {u.streak}d</td>
 <td className="px-4 py-3 text-muted">{u.lastActive ? new Date(u.lastActive).toLocaleDateString() : '—'}</td>
 <td className="px-4 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
 <td className="px-4 py-3">
 <button
 onClick={() => setSelected(u)}
 className="px-3 py-1.5 bg-secondary dark:bg-card/5 text-muted rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors font-bold text-[10px]"
 >
 Manage
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 <div className="flex items-center justify-between px-4 py-3 border-t border-border/10 dark:border-border">
 <span className="text-[10px] text-muted font-bold">Page {page} of {pages}</span>
 <div className="flex gap-2">
 <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg bg-secondary dark:bg-card/5 text-muted disabled:opacity-30">
 <ChevronLeft className="w-4 h-4" />
 </button>
 <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-1.5 rounded-lg bg-secondary dark:bg-card/5 text-muted disabled:opacity-30">
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>

 {/* User Management Drawer */}
 {selected && (
 <div className="fixed inset-0 z-50 flex justify-end">
 <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
 <div className="relative w-full max-w-sm bg-card h-full overflow-y-auto shadow-2xl p-6 space-y-5 flex flex-col">
 <div className="flex items-center justify-between">
 <h3 className="font-black text-foreground text-sm">Manage User</h3>
 <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground dark:hover:text-white">
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="glass rounded-2xl p-4 border border-border/10 dark:border-border">
 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xl font-black mb-3">
 {selected.name?.charAt(0)}
 </div>
 <p className="font-black text-foreground text-sm">{selected.name}</p>
 <p className="text-xs text-muted">{selected.email}</p>
 <div className="flex gap-2 mt-3">
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${tierColors[selected.tier]}`}>{selected.tier}</span>
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${roleColors[selected.role]}`}>{selected.role}</span>
 </div>
 <p className="text-xs text-emerald-500 font-bold mt-2">🔥 {selected.streak} day streak</p>
 </div>

 <div className="space-y-2 flex-1">
 <p className="text-[10px] font-black text-muted uppercase tracking-widest">Change Tier</p>
 {['free', 'premium', 'pro'].map(t => (
 <button key={t} onClick={() => doAction('setTier', t)} disabled={actionLoading}
 className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all ${selected.tier === t ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-secondary/50 dark:bg-card/5 text-muted border-border/20 dark:border-border hover:border-emerald-500/30'}`}>
 {t.toUpperCase()} {selected.tier === t ? '✓' : ''}
 </button>
 ))}

 <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-4">Actions</p>
 <button onClick={() => doAction('resetStreak')} disabled={actionLoading}
 className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2">
 <Zap className="w-3.5 h-3.5" /> Reset Streak
 </button>
 <button onClick={() => doAction('setRole', selected.role === 'admin' ? 'user' : 'admin')} disabled={actionLoading}
 className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2">
 <ShieldCheck className="w-3.5 h-3.5" /> {selected.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
 </button>
 <button onClick={() => deleteUser(selected._id)} disabled={actionLoading}
 className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
 <Trash2 className="w-3.5 h-3.5" /> Delete Account
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
