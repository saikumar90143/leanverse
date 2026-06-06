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
 <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border/20 dark:border-border px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
 {/* Left: Hamburger + Title */}
 <div className="flex items-center gap-3">
 <button
 onClick={onMenuOpen}
 className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-secondary dark:bg-card/5 text-muted hover:text-foreground dark:hover:text-white transition-colors"
 aria-label="Open Admin Menu"
 >
 <Menu className="w-5 h-5" />
 </button>
 <div>
 <h2 className="text-sm font-black text-foreground">{sectionTitles[activeSection]}</h2>
 <p className="text-[10px] font-bold text-muted hidden sm:block">LeanVerse Admin Panel</p>
 </div>
 </div>

 {/* Center: Search */}
 <div className="hidden sm:flex flex-1 max-w-md mx-4">
 <div className="relative w-full">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted " />
 <input
 type="text"
 placeholder="Search across all sections..."
 value={searchQuery}
 onChange={(e) => onSearch(e.target.value)}
 className="w-full pl-9 pr-4 py-2 bg-secondary/80 dark:bg-card/5 border border-border/30 dark:border-border rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors text-foreground placeholder:text-muted dark:placeholder:text-zinc-600"
 />
 </div>
 </div>

 {/* Right: Actions */}
 <div className="flex items-center gap-2">
 <button
 onClick={onToggleDark}
 className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-secondary dark:bg-card/5 text-muted hover:text-foreground dark:hover:text-white transition-colors"
 aria-label="Toggle Theme"
 >
 {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 </button>
 <button className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-secondary dark:bg-card/5 text-muted hover:text-foreground dark:hover:text-white transition-colors" aria-label="Notifications">
 <Bell className="w-5 h-5" />
 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
 </button>
 <div className="flex items-center gap-2 pl-2 border-l border-border/30 dark:border-border">
 <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-black">
 {user?.name?.charAt(0) || 'A'}
 </div>
 <div className="hidden sm:block">
 <p className="text-[10px] font-black text-foreground ">{user?.name || 'Admin'}</p>
 <p className="text-[9px] text-muted ">{user?.email || ''}</p>
 </div>
 <button
 onClick={logout}
 className="ml-1 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-muted hover:text-rose-500 transition-colors"
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
