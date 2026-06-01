'use client';

import React, { useState } from 'react';
import { 
  Users, DollarSign, Calendar, FileText, CheckCircle2, 
  Trash, Plus, Sparkles, Shield, ToggleLeft, ToggleRight, PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminDashboard() {
  // Ads settings
  const [adsEnabled, setAdsEnabled] = useState(true);
  
  // Blog Builder States
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Indian diet plans');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');

  // Mock User management
  const [users, setUsers] = useState([
    { id: '1', name: 'Rohan Sharma', email: 'user@leanverse.com', role: 'user', tier: 'premium', streak: 5 },
    { id: '2', name: 'Vikram Rathore', email: 'vikram@ppl.com', role: 'user', tier: 'pro', streak: 12 },
    { id: '3', name: 'Sarah Jenkins', email: 'sarah@hiit.com', role: 'user', tier: 'free', streak: 2 },
  ]);

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;

    confetti({
      particleCount: 50,
      spread: 50,
      colors: ['#06b6d4', '#10b981'],
    });

    alert(`Blog Article "${blogTitle}" compiled and added successfully to database CMS!`);
    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
  };

  const handleToggleTier = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextTier = u.tier === 'free' ? 'premium' : u.tier === 'premium' ? 'pro' : 'free';
          return { ...u, tier: nextTier };
        }
        return u;
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass rounded-3xl p-6 border border-cyan-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -z-10 animate-pulse" />

        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center">
              LeanVerse Admin Panel
              <Sparkles className="w-4.5 h-4.5 ml-1.5 text-amber-400" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Secure core monitoring console.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Quick metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass p-5 rounded-2xl border border-slate-200/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Monthly Revenue</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 block">$4,850</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-slate-200/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Active Members</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 block">{users.length + 15}</span>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Ads Toggler Card */}
        <div className="glass p-5 rounded-2xl border border-slate-200/10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Google AdSense Status</span>
            <span className={`text-sm font-black mt-0.5 block ${adsEnabled ? 'text-emerald-500' : 'text-red-500'}`}>
              {adsEnabled ? 'Ads Display Enabled' : 'Ads Block Active'}
            </span>
          </div>
          <button 
            onClick={() => setAdsEnabled(!adsEnabled)}
            className="text-slate-500 hover:text-emerald-500 cursor-pointer transition-all"
          >
            {adsEnabled ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Management Registry */}
        <div className="lg:col-span-6 glass rounded-3xl p-6 border border-slate-200/10 space-y-5">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block border-b border-slate-200/10 pb-3">User Registry</span>
          
          <div className="space-y-3.5">
            {users.map((u) => (
              <div key={u.id} className="p-4 bg-slate-200/20 dark:bg-white/5 border border-slate-350/5 rounded-2xl flex items-center justify-between text-xs font-semibold">
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 block">{u.name}</span>
                  <span className="text-slate-400 block font-bold">{u.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleTier(u.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-300/10 text-emerald-500 cursor-pointer uppercase font-extrabold"
                  >
                    {u.tier}
                  </button>
                  <span className="text-slate-400 font-bold">{u.streak}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Builder CMS Editor block */}
        <div className="lg:col-span-6 glass rounded-3xl p-6 border border-slate-200/10 space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-3">
            <PenTool className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Blog CMS Builder</span>
          </div>

          <form onSubmit={handleCreateBlog} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block ml-1">Article Title</label>
              <input
                type="text"
                placeholder="e.g. 5 Myths About Whey Protein"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                required
                className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block ml-1">Category</label>
                <select
                  value={blogCategory}
                  onChange={(e) => setBlogCategory(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="Indian diet plans">Indian Diet</option>
                  <option value="Gym workouts">Gym Workout</option>
                  <option value="Home workouts">Home Workout</option>
                  <option value="Supplements">Supplements</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block ml-1">Target Slug</label>
                <input
                  type="text"
                  placeholder="myths-whey-protein"
                  disabled
                  value={blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}
                  className="w-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block ml-1">Summary</label>
              <textarea
                placeholder="Write a brief excerpt..."
                value={blogSummary}
                onChange={(e) => setBlogSummary(e.target.value)}
                required
                rows={2}
                className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 font-medium text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-md transition-all active:scale-97 cursor-pointer text-xs"
            >
              Assemble & Publish Article
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
