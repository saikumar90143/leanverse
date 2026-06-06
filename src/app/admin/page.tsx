'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';
import AdminSidebar, { type AdminSection } from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

// Lazy-loaded sections
import OverviewSection from './components/sections/OverviewSection';
import UsersSection from './components/sections/UsersSection';
import WorkoutsSection from './components/sections/WorkoutsSection';
import ExercisesSection from './components/sections/ExercisesSection';
import FoodDatabaseSection from './components/sections/FoodDatabaseSection';
import DietPlansSection from './components/sections/DietPlansSection';
import BlogSection from './components/sections/BlogSection';
import AISection from './components/sections/AISection';
import SubscriptionsSection from './components/sections/SubscriptionsSection';
import AdsSection from './components/sections/AdsSection';
import AffiliatesSection from './components/sections/AffiliatesSection';
import NotificationsSection from './components/sections/NotificationsSection';
import TransformationSection from './components/sections/TransformationSection';
import ReportsSection from './components/sections/ReportsSection';
import SupportSection from './components/sections/SupportSection';
import SecuritySection from './components/sections/SecuritySection';
import GrowthSection from './components/sections/GrowthSection';

export default function AdminPage() {
 const { user, loading } = useAuth();
 const router = useRouter();

 const [activeSection, setActiveSection] = useState<AdminSection>('overview');
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [darkMode, setDarkMode] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');

 // Role Guard
 useEffect(() => {
 if (!loading && user?.role !== 'admin') {
 router.replace('/');
 }
 }, [user, loading, router]);

 // Sync dark mode with document
 useEffect(() => {
 const isDark = document.documentElement.classList.contains('dark');
 setDarkMode(isDark);
 }, []);

 const toggleDark = () => {
 document.documentElement.classList.toggle('dark');
 setDarkMode(d => !d);
 };

 if (loading) {
 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background ">
 <div className="flex flex-col items-center gap-4">
 <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
 <p className="text-sm font-bold text-muted">Authenticating...</p>
 </div>
 </div>
 );
 }

 if (!user || user.role !== 'admin') {
 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background ">
 <div className="text-center space-y-3">
 <p className="text-3xl">🔒</p>
 <p className="font-black text-foreground ">Access Denied</p>
 <p className="text-sm text-muted">This area requires admin privileges.</p>
 </div>
 </div>
 );
 }

 const sectionComponents: Record<AdminSection, React.ReactNode> = {
 overview: <OverviewSection />,
 users: <UsersSection />,
 workouts: <WorkoutsSection />,
 exercises: <ExercisesSection />,
 food_database: <FoodDatabaseSection />,
 diet: <DietPlansSection />,
 blogs: <BlogSection />,
 ai: <AISection />,
 subscriptions: <SubscriptionsSection />,
 ads: <AdsSection />,
 affiliates: <AffiliatesSection />,
 notifications: <NotificationsSection />,
 transformation: <TransformationSection />,
 reports: <ReportsSection />,
 support: <SupportSection />,
 security: <SecuritySection />,
 growth: <GrowthSection />,
 };

 return (
 <div className="fixed inset-0 z-[100] bg-background flex overflow-hidden">
 {/* Sidebar */}
 <AdminSidebar
 active={activeSection}
 onSelect={setActiveSection}
 isOpen={sidebarOpen}
 onClose={() => setSidebarOpen(false)}
 />

 {/* Main Content Area */}
 <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
 {/* Header */}
 <AdminHeader
 activeSection={activeSection}
 onMenuOpen={() => setSidebarOpen(true)}
 darkMode={darkMode}
 onToggleDark={toggleDark}
 searchQuery={searchQuery}
 onSearch={setSearchQuery}
 />

 {/* Section Content */}
 <main className="flex-1 p-4 sm:p-6 overflow-auto">
 <div key={activeSection} className="animate-in fade-in duration-200">
 {sectionComponents[activeSection]}
 </div>
 </main>
 </div>
 </div>
 );
}
