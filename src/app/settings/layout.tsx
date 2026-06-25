'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '@/components/layout/AuthProvider';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen pt-24 text-center">Loading settings...</div>;
  }

  const tabs = [
    {
      name: 'Account Security',
      path: '/settings/security',
      icon: ShieldCheck,
      show: user?.authProvider !== 'google',
    },
    {
      name: 'Notifications',
      path: '/settings/notifications',
      icon: Bell,
      show: true,
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Settings</h1>
          <p className="text-muted text-sm mt-1">Manage your account preferences and security.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {tabs.filter(tab => tab.show).map((tab) => {
                const isActive = pathname === tab.path;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-bold'
                        : 'text-foreground hover:bg-secondary/50 dark:hover:bg-card/50 font-medium'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
