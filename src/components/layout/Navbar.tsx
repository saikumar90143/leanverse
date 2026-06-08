'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { 
  Sun, Moon, Menu, X, Flame, User, Calculator, 
  Dumbbell, Apple, Trophy, ShoppingBag, LayoutDashboard, LogOut, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserStorageKey } from '@/lib/storage';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasActiveWorkout, setHasActiveWorkout] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkActiveWorkout = () => {
      if (!user) {
        setHasActiveWorkout(false);
        return;
      }
      const key = getUserStorageKey('leanverse_transformation');
      const state = localStorage.getItem(key);
      setHasActiveWorkout(!!state);
    };
    checkActiveWorkout();
    
    // Listen to storage events (cross-tab) and custom events (same-tab)
    window.addEventListener('storage', checkActiveWorkout);
    window.addEventListener('leanverse_state_changed', checkActiveWorkout);
    return () => {
      window.removeEventListener('storage', checkActiveWorkout);
      window.removeEventListener('leanverse_state_changed', checkActiveWorkout);
    };
  }, [user]);

  // PWA install prompt
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Already installed as PWA?
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    if (localStorage.getItem('lv_app_installed')) {
      setIsInstalled(true);
      return;
    }
    // Pick up prompt that may have fired before component mounted
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).__lv_install_prompt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setInstallPrompt((window as any).__lv_install_prompt);
    }
    const handler = (e: Event) => {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lv_install_prompt = e;
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      localStorage.setItem('lv_app_installed', 'true');
    });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCalcDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Diet Planner', path: '/diet-planner', icon: Apple },
    { name: 'Personal Records', path: '/personal-records', icon: Trophy },
    { name: 'Recipes', path: '/recipes', icon: Flame },
    { name: 'Store', path: '/store', icon: ShoppingBag },
    { name: 'Blog', path: '/blog' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const calculators = [
    { name: 'BMI Calculator', path: '/calculators/bmi' },
    { name: 'Maintenance Calories', path: '/calculators/maintenance' },
    { name: 'Macro Calculator', path: '/calculators/macro' },
    { name: 'Body Fat Calculator', path: '/calculators/body-fat' },
    { name: 'Water Intake', path: '/calculators/water' },
  ];

  const isActive = (path: string) => pathname === path;

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass-nav py-3 shadow-lg' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full gap-4 lg:gap-8">
          {/* Left Area: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <img src="/icon.svg" alt="LeanVerse Logo" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <span className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent leading-none pb-1">
                LEAN<span className="font-light text-foreground">VERSE</span>
              </span>
            </Link>
          </div>

          {/* Center Area: Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`relative px-3 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                    isActive(link.path)
                      ? 'text-emerald-500 dark:text-emerald-400 font-bold'
                      : 'text-foreground hover:text-emerald-500 dark:text-muted dark:hover:text-emerald-400'
                  }`}
                >
                  {isActive(link.path) && (
                    <motion.span 
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}

              {/* Calculators Dropdown Container */}
              <div className="relative">
                <button 
                  onClick={() => setCalcDropdownOpen(!calcDropdownOpen)}
                  onBlur={() => setTimeout(() => setCalcDropdownOpen(false), 200)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                    pathname.startsWith('/calculators')
                      ? 'text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/10 dark:bg-emerald-500/20'
                      : 'text-foreground hover:text-emerald-500 dark:text-muted dark:hover:text-emerald-400'
                  }`}
                >
                  <Calculator className="w-4 h-4 mr-1" />
                  <span>Calculators</span>
                </button>

                <AnimatePresence>
                  {calcDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl py-2 shadow-2xl border border-border/20 dark:border-border bg-background/98 dark:bg-background/98 backdrop-blur-xl"
                    >
                      {calculators.map((calc) => (
                        <Link
                          key={calc.path}
                          href={calc.path}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-emerald-500/10 dark:text-muted dark:hover:bg-emerald-400/20 hover:text-emerald-500 dark:hover:text-emerald-400 font-medium transition-all"
                        >
                          {calc.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* Right Area Widgets */}
          <div className="hidden lg:flex items-center justify-end space-x-2 lg:space-x-4 shrink-0">
            {/* Install App Button — shows only when installable */}
            {isMounted && installPrompt && !isInstalled && (
              <button
                onClick={async () => {
                  try {
                    await installPrompt.prompt();
                    const choice = await installPrompt.userChoice;
                    if (choice.outcome === 'accepted') {
                      setIsInstalled(true);
                      setInstallPrompt(null);
                      localStorage.setItem('lv_app_installed', 'true');
                    }
                  } catch {}
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-full border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:bg-emerald-500/10 transition-all"
                title="Install LeanVerse App"
              >
                <Download className="w-4 h-4" />
                <span className="hidden xl:inline">Install App</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full glass hover:bg-secondary/20 dark:hover:bg-card/10 text-foreground dark:text-muted cursor-pointer transition-all active:scale-95"
              aria-label="Toggle Theme"
            >
              {isMounted ? (theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-foreground" />) : <div className="w-5 h-5" />}
            </button>

            {/* Streak Counter if logged in */}
            {isMounted && user && (
              <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 text-sm font-bold shadow-sm animate-pulse">
                <Flame className="w-4 h-4 fill-current" />
                <span>{user.streak} Days Streak</span>
              </div>
            )}

            {/* User Session Widget */}
            {isMounted && (user ? (
              <div className="flex items-center space-x-2 lg:space-x-3">
                {hasActiveWorkout && (
                  <Link 
                    href="/workout-planner"
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-lg hover:shadow-cyan-500/20"
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span className=" sm:inline">Active Workout</span>
                  </Link>
                )}
                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin"
                    className="px-3 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-all shadow-md"
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full glass text-muted hover:text-red-500 hover:bg-red-500/10 dark:text-muted dark:hover:text-red-400 dark:hover:bg-red-500/20 transition-all cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ) : (
              <Link 
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/15 scale-100 hover:scale-103 active:scale-97"
              >
                <User className="w-4 h-4" />
                <span>Get Started</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex lg:hidden flex-1 items-center justify-end space-x-1.5 sm:space-x-3 shrink-0">
            {isMounted && user && (
              <div className="flex items-center space-x-0.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{user.streak}d</span>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full glass text-foreground dark:text-muted"
              aria-label="Toggle Theme"
            >
              {isMounted ? (theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-foreground" />) : <div className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full glass text-foreground dark:text-muted"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card dark:bg-secondary border-t border-border/20 dark:border-border mt-3 max-h-[85vh] overflow-y-auto shadow-2xl rounded-b-3xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2.5 rounded-2xl text-base font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                      : 'text-foreground hover:bg-secondary/20 dark:hover:bg-card/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-border/10 dark:border-border my-2 pt-2">
                <span className="px-4 text-xs font-extrabold text-muted uppercase tracking-widest block mb-2">Calculators</span>
                <div className="grid grid-cols-2 gap-1.5 px-2">
                  {calculators.map((calc) => (
                    <Link
                      key={calc.path}
                      href={calc.path}
                      className={`px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all truncate block ${
                        isActive(calc.path)
                          ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                          : 'text-foreground hover:text-emerald-500 dark:text-muted dark:hover:text-emerald-400 hover:bg-secondary/10 dark:hover:bg-card/5'
                      }`}
                      title={calc.name.replace(' Calculator', '')}
                    >
                      {calc.name.replace(' Calculator', '')}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/10 dark:border-border my-2 pt-4 flex flex-col items-center">
                {user ? (
                  <div className="w-full space-y-2 text-center">
                    {hasActiveWorkout && (
                      <Link 
                        href="/workout-planner"
                        className="block w-full py-3 rounded-2xl bg-cyan-500 text-white font-bold shadow-md"
                      >
                        Active Workout
                      </Link>
                    )}
                    <Link 
                      href="/dashboard"
                      className="block w-full py-3 rounded-2xl bg-emerald-500 text-white font-bold shadow-md"
                    >
                      My Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        href="/admin"
                        className="block w-full py-2.5 rounded-2xl bg-cyan-600 text-white font-bold shadow-sm"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={logout}
                      className="block w-full text-sm font-semibold text-muted hover:text-red-500 py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    className="block w-full text-center py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg"
                  >
                    Get Started / Login
                  </Link>
                )}
              </div>

              {/* Install App in mobile menu */}
              {!isInstalled && (
                <div className="border-t border-border/10 dark:border-border pt-3">
                  <button
                    onClick={async () => {
                      if (installPrompt) {
                        try {
                          await installPrompt.prompt();
                          const choice = await installPrompt.userChoice;
                          if (choice.outcome === 'accepted') {
                            setIsInstalled(true);
                            setInstallPrompt(null);
                            localStorage.setItem('lv_app_installed', 'true');
                          }
                        } catch {}
                      } else {
                        alert('To install: tap your browser menu (3-dot menu or Share) then tap "Add to Home Screen"');
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl border-2 border-dashed border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-500/5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install LeanVerse App</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
