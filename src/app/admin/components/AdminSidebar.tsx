'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Dumbbell, Zap, Apple, FileText, Bot, CreditCard,
  Megaphone, ShoppingBag, Bell, Trophy, BarChart3, HeadphonesIcon, Shield,
  TrendingUp, ChevronRight, X, Settings, ListPlus
} from 'lucide-react';

export type AdminSection =
  | 'overview' | 'users' | 'workouts' | 'exercises' | 'food_database' | 'diet' | 'blogs'
  | 'ai' | 'subscriptions' | 'ads' | 'affiliates' | 'notifications'
  | 'transformation' | 'reports' | 'support' | 'security' | 'growth';

const navItems: { id: AdminSection; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell },
  { id: 'exercises', label: 'Exercises', icon: Zap },
  { id: 'food_database', label: 'Food Database', icon: Apple },
  { id: 'diet', label: 'Diet Plans', icon: ListPlus },
  { id: 'blogs', label: 'Blog CMS', icon: FileText },
  { id: 'ai', label: 'AI Settings', icon: Bot },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'ads', label: 'Advertisements', icon: Megaphone },
  { id: 'affiliates', label: 'Affiliates', icon: ShoppingBag },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'transformation', label: 'Transformation', icon: Trophy },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'support', label: 'Support', icon: HeadphonesIcon, badge: 'new' },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'growth', label: 'Growth', icon: TrendingUp },
];

interface Props {
  active: AdminSection;
  onSelect: (s: AdminSection) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ active, onSelect, isOpen, onClose }: Props) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-wider">LEAN<span className="text-emerald-400">VERSE</span></span>
              <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Super Admin</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-zinc-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onSelect(item.id); onClose(); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {item.badge && (
                    <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-full uppercase">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
