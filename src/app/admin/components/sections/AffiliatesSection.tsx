'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, ExternalLink, TrendingUp, MousePointer, DollarSign } from 'lucide-react';

interface Affiliate {
  _id: string;
  name: string;
  brand: string;
  affiliateLink: string;
  commission: number;
  price: number;
  rating: number;
  category: string;
  isActive: boolean;
  clicks: number;
  conversions: number;
  earnings: number;
}

const CATEGORIES = ['Whey Protein', 'Creatine', 'Vitamins', 'Gym Equipment', 'Fitness Accessories', 'Pre-Workout', 'Fat Burner', 'Other'];

const empty = () => ({
  name: '', brand: '', affiliateLink: '', commission: 5,
  price: 0, rating: 4.0, category: 'Whey Protein', isActive: true, imageUrl: ''
});

export default function AffiliatesSection() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(empty());
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await fetch(`/api/admin/affiliates?${params}`);
      const data = await res.json();
      setAffiliates(data.affiliates || []);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  }, [categoryFilter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const save = async () => {
    setSaving(true);
    try {
      const method = editing._id ? 'PATCH' : 'POST';
      const res = await fetch('/api/admin/affiliates', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing._id ? { id: editing._id, ...editing } : editing),
      });
      if (res.ok) { setShowModal(false); setEditing(empty()); fetch_(); }
    } catch {}
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this affiliate?')) return;
    await fetch('/api/admin/affiliates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetch_();
  };

  const totalClicks = affiliates.reduce((a, b) => a + b.clicks, 0);
  const totalConversions = affiliates.reduce((a, b) => a + b.conversions, 0);
  const totalEarnings = affiliates.reduce((a, b) => a + b.earnings, 0);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: MousePointer, color: 'text-cyan-500 bg-cyan-500/10' },
          { label: 'Conversions', value: totalConversions.toLocaleString(), icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-amber-500 bg-amber-500/10' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-slate-200/10 dark:border-white/5 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold">{s.label}</p>
              <p className="text-xl font-black text-slate-800 dark:text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 bg-white/50 dark:bg-white/5 border border-slate-200/20 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => { setEditing(empty()); setShowModal(true); }}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold rounded-xl shadow-md">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading...</div>
        ) : affiliates.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400">
            No affiliate products. <button onClick={() => { setEditing(empty()); setShowModal(true); }} className="text-emerald-500 underline">Add one!</button>
          </div>
        ) : affiliates.map((af) => (
          <div key={af._id} className="glass rounded-2xl p-5 border border-slate-200/10 dark:border-white/5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-black text-slate-800 dark:text-white text-sm">{af.name}</p>
                <p className="text-xs text-slate-400">{af.brand} · {af.category}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${af.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'}`}>
                {af.isActive ? 'Active' : 'Paused'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-100/50 dark:bg-white/5 rounded-xl p-2">
                <p className="text-[10px] text-slate-400">Clicks</p>
                <p className="font-black text-slate-700 dark:text-zinc-200">{af.clicks}</p>
              </div>
              <div className="bg-slate-100/50 dark:bg-white/5 rounded-xl p-2">
                <p className="text-[10px] text-slate-400">Conv.</p>
                <p className="font-black text-slate-700 dark:text-zinc-200">{af.conversions}</p>
              </div>
              <div className="bg-slate-100/50 dark:bg-white/5 rounded-xl p-2">
                <p className="text-[10px] text-slate-400">Commission</p>
                <p className="font-black text-emerald-500">{af.commission}%</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={af.affiliateLink} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 rounded-xl text-xs font-bold hover:text-emerald-500 transition-colors">
                <ExternalLink className="w-3 h-3" /> Preview
              </a>
              <button onClick={() => { setEditing(af); setShowModal(true); }} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => del(af._id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/20 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/10 dark:border-white/5">
              <h3 className="font-black text-slate-800 dark:text-white">{editing._id ? 'Edit Product' : 'Add Affiliate Product'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-3 max-h-[65vh] overflow-y-auto">
              {[
                { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. MyProtein Impact Whey' },
                { label: 'Brand', key: 'brand', type: 'text', placeholder: 'MyProtein' },
                { label: 'Image URL', key: 'imageUrl', type: 'url', placeholder: 'https://images.unsplash.com/...' },
                { label: 'Affiliate Link', key: 'affiliateLink', type: 'url', placeholder: 'https://...' },
                { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '2499' },
                { label: 'Commission (%)', key: 'commission', type: 'number', placeholder: '8' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">{label}</label>
                  <input type={type} value={editing[key] === undefined || Number.isNaN(editing[key]) ? '' : editing[key]} placeholder={placeholder}
                    onChange={(e) => setEditing((p: any) => ({ ...p, [key]: type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value)) : e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-white/5 border border-slate-200/20 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Category</label>
                <select value={editing.category} onChange={(e) => setEditing((p: any) => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-100/50 dark:bg-zinc-800 border border-slate-200/20 dark:border-white/10 rounded-xl text-sm focus:outline-none">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200/10 dark:border-white/5 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-500">Cancel</button>
              <button onClick={save} disabled={saving || !editing.name || !editing.affiliateLink}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white disabled:opacity-50">
                {saving ? 'Saving...' : editing._id ? 'Update' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
