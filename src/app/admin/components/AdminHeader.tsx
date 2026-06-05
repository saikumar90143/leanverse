'use client';

import React from 'react';
import { Menu, Search, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '@/components/layout/AuthProvider';
import { AdminSection } from './AdminSidebar';

interface Props {
  activeSection: AdminSection;
  onMenuOpen: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}

const sectionTitles: Record<AdminSection, string> = {
  overview: 'Dashboard Overview',
  users: 'User Management',
  workouts: 'Workout Management',
  exercises: 'Exercise Database',
  food_database: 'Food Database',
  diet: 'Diet Plan Management',
  blogs: 'Blog CMS',
  ai: 'AI Settings & Prompts',
  subscriptions: 'Subscription Management',
  ads: 'Advertisement Management',
  affiliates: 'Affiliate Management',
  notifications: 'Push Notifications',
  transformation: 'Transformation Control Center',
  reports: 'Reports & Analytics',
  support: 'Support System',
  security: 'Security & Settings',
  growth: 'Growth Dashboard',
};

export default function AdminHeader({ activeSection, onMenuOpen, darkMode, onToggleDark, searchQuery, onSearch }: Props) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200/20 dark:border-white/5 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          aria-label="Open Admin Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-black text-slate-800 dark:text-white">{sectionTitles[activeSection]}</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 hidden sm:block">LeanVerse Admin Panel</p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden sm:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search across all sections..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100/80 dark:bg-white/5 border border-slate-200/30 dark:border-white/5 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors text-slate-700 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/30 dark:border-white/10">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-black">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-slate-700 dark:text-zinc-200">{user?.name || 'Admin'}</p>
            <p className="text-[9px] text-slate-400 dark:text-zinc-500">{user?.email || ''}</p>
          </div>
          <button
            onClick={logout}
            className="ml-1 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 dark:text-zinc-500 hover:text-rose-500 transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
