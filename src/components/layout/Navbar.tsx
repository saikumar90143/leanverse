'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { 
  Sun, Moon, Menu, X, Flame, User, Calculator, 
  Dumbbell, Apple, Trophy, ShoppingBag, LayoutDashboard, LogOut, Download, Bell, Camera, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserStorageKey } from '@/lib/storage';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const [scrolled, setScrolled] = useState(false);
  const [hiddenTopNav, setHiddenTopNav] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const lastScrollY = useRef(0);
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
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      // Hide top nav on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 50) {
        setHiddenTopNav(true);
      } else if (currentScrollY < lastScrollY.current - 10 || currentScrollY <= 50) {
        setHiddenTopNav(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Virtual Keyboard Protection
  useEffect(() => {
    const handleFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        const type = (target as HTMLInputElement).type;
        if (!['radio', 'checkbox', 'button', 'submit', 'image', 'color'].includes(type)) {
          setKeyboardOpen(true);
        }
      }
    };
    const handleBlur = () => setKeyboardOpen(false);

    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);

    return () => {
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCalcDropdownOpen(false);
  }, [pathname]);


  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Workout Planner', path: '/workout-planner', icon: Dumbbell },
    { name: 'Diet Planner', path: '/diet-planner', icon: Apple },
    { name: 'Food Scanner', path: '/food-scanner', icon: Camera },
    { name: 'Personal Records', path: '/personal-records', icon: Trophy },
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
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-nav py-3 shadow-lg' 
          : 'bg-transparent py-5'
      } ${hiddenTopNav ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full gap-4 lg:gap-8">
          {/* Left Area: Logo */}
          <div className="flex items-center shrink-0">
            <Link 
              href="/" 
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center space-x-2 shrink-0"
            >
              <Image src="/icon.svg" alt="LeanVerse Logo" width={36} height={36} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" priority />
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
                  prefetch={!['/', '/workout-planner', '/diet-planner'].includes(link.path) ? false : undefined}
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
                          prefetch={false}
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
                    <span className=" sm:inline">My Workout Plan</span>
                  </Link>
                )}
                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link 
                  href="/settings/notifications"
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full glass text-muted hover:text-emerald-500 hover:bg-emerald-500/10 dark:text-muted dark:hover:text-emerald-400 dark:hover:bg-emerald-500/20 transition-all cursor-pointer"
                  title="Notification Settings"
                  aria-label="Notification Settings"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin"
                    prefetch={false}
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
          </div>

        </div>
      </div>

      </header>

      {/* Mobile Drawer menu / Bottom Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-[51] bg-background/90"
          />
        )}
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
            className="lg:hidden fixed top-0 right-0 bottom-[calc(64px+env(safe-area-inset-bottom))] w-[80vw] sm:w-[350px] z-[52] bg-card dark:bg-secondary border-l border-border/20 dark:border-border overflow-y-auto shadow-2xl rounded-l-3xl will-change-transform"
          >
              <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col relative">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-secondary/50 dark:bg-card/50 text-foreground hover:bg-secondary dark:hover:bg-card transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="mb-2">
                  <span className="px-4 text-sm font-bold text-foreground block mt-2">More Options</span>
                </div>
                {navLinks
                  .filter(link => !['/', '/workout-planner', '/diet-planner', '/food-scanner', '/personal-records'].includes(link.path))
                  .map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
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
                        prefetch={false}
                        onClick={() => setMobileMenuOpen(false)}
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
                      <Link 
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full py-3 rounded-2xl bg-emerald-500 text-white font-bold shadow-md"
                      >
                        My Dashboard
                      </Link>
                      <Link 
                        href="/settings/notifications"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full py-2.5 rounded-2xl bg-secondary dark:bg-card/20 text-foreground font-bold shadow-sm"
                      >
                        Notification Settings
                      </Link>
                      {user.role === 'admin' && (
                        <Link 
                          href="/admin"
                          prefetch={false}
                          onClick={() => setMobileMenuOpen(false)}
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
                      onClick={() => setMobileMenuOpen(false)}
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background/95 dark:bg-background/95 backdrop-blur-xl border-t border-border/20 dark:border-border pb-safe transition-all duration-300 touch-manipulation select-none ${keyboardOpen ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="flex items-center justify-between px-1 sm:px-2 h-16">
          <Link href="/" className="relative flex flex-col items-center justify-center w-full h-full space-y-1 touch-manipulation">
            {isActive('/') && (
              <motion.div layoutId="bottomNavIndicator" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-b-full shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />
            )}
            <Home className={`w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] transition-all duration-300 ${isActive('/') ? 'text-emerald-500 dark:text-emerald-400 scale-110' : 'text-foreground/60 dark:text-muted'}`} />
            <span className={`text-[9px] sm:text-[10px] font-semibold truncate w-full text-center transition-all ${isActive('/') ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground/60 dark:text-muted'}`}>Home</span>
          </Link>
          <Link href="/workout-planner" className="relative flex flex-col items-center justify-center w-full h-full space-y-1 touch-manipulation">
            {isActive('/workout-planner') && (
              <motion.div layoutId="bottomNavIndicator" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-b-full shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />
            )}
            <Dumbbell className={`w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] transition-all duration-300 ${isActive('/workout-planner') ? 'text-emerald-500 dark:text-emerald-400 scale-110' : 'text-foreground/60 dark:text-muted'}`} />
            <span className={`text-[9px] sm:text-[10px] font-semibold truncate w-full text-center transition-all ${isActive('/workout-planner') ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground/60 dark:text-muted'}`}>Workout</span>
          </Link>
          <Link href="/diet-planner" className="relative flex flex-col items-center justify-center w-full h-full space-y-1 touch-manipulation">
            {isActive('/diet-planner') && (
              <motion.div layoutId="bottomNavIndicator" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-b-full shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />
            )}
            <Apple className={`w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] transition-all duration-300 ${isActive('/diet-planner') ? 'text-emerald-500 dark:text-emerald-400 scale-110' : 'text-foreground/60 dark:text-muted'}`} />
            <span className={`text-[9px] sm:text-[10px] font-semibold truncate w-full text-center transition-all ${isActive('/diet-planner') ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground/60 dark:text-muted'}`}>Diet</span>
          </Link>
          <Link href="/food-scanner" className="relative flex flex-col items-center justify-center w-full h-full space-y-1 touch-manipulation">
            {isActive('/food-scanner') && (
              <motion.div layoutId="bottomNavIndicator" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-b-full shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />
            )}
            <Camera className={`w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] transition-all duration-300 ${isActive('/food-scanner') ? 'text-emerald-500 dark:text-emerald-400 scale-110' : 'text-foreground/60 dark:text-muted'}`} />
            <span className={`text-[9px] sm:text-[10px] font-semibold truncate w-full text-center transition-all ${isActive('/food-scanner') ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground/60 dark:text-muted'}`}>Scanner</span>
          </Link>
          <Link href="/personal-records" className="relative flex flex-col items-center justify-center w-full h-full space-y-1 touch-manipulation">
            {isActive('/personal-records') && (
              <motion.div layoutId="bottomNavIndicator" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-b-full shadow-[0_2px_8px_rgba(16,185,129,0.5)]" />
            )}
            <Trophy className={`w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] transition-all duration-300 ${isActive('/personal-records') ? 'text-emerald-500 dark:text-emerald-400 scale-110' : 'text-foreground/60 dark:text-muted'}`} />
            <span className={`text-[9px] sm:text-[10px] font-semibold truncate w-full text-center transition-all ${isActive('/personal-records') ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground/60 dark:text-muted'}`}>PR</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative flex flex-col items-center justify-center w-full h-full space-y-1 touch-manipulation"
          >
            {mobileMenuOpen ? (
              <X className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] text-emerald-500 dark:text-emerald-400 scale-110 transition-all duration-300" />
            ) : (
              <Menu className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] text-foreground/60 dark:text-muted transition-all duration-300" />
            )}
            <span className={`text-[9px] sm:text-[10px] font-semibold truncate w-full text-center transition-all ${mobileMenuOpen ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground/60 dark:text-muted'}`}>Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
