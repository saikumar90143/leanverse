'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Apple, Dumbbell, Activity, Heart, Shield, Mail } from 'lucide-react';

export default function Footer() {
 const [email, setEmail] = useState('');
 const [subscribed, setSubscribed] = useState(false);

 const handleSubscribe = (e: React.FormEvent) => {
 e.preventDefault();
 if (email) {
 setSubscribed(true);
 setEmail('');
 }
 };

  const footerLinks = {
    features: [
      { name: 'Diet Planner', path: '/diet-planner', icon: Apple },
      { name: 'Workout Planner', path: '/workout-planner', icon: Dumbbell },
      { name: 'Supplements', path: '/store', icon: Shield },
    ],
    calculators: [
      { name: 'BMI & Body Fat', path: '/calculators/body-fat' },
      { name: 'Calories & Macros', path: '/calculators/macro' },
      { name: 'Water Intake', path: '/calculators/water' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Blog', path: '/blog' },
    ],
    legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Medical Disclaimer', path: '/disclaimer' },
    ],
  };

 const pathname = usePathname();

 // Hide on admin routes
 if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-border/20 dark:border-border bg-secondary dark:bg-background text-muted py-10 sm:py-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top: Logo + description + newsletter */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-8 sm:mb-12">
          <div className="flex-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                LEAN<span className="font-light text-foreground">VERSE</span>
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-sm">
              AI-powered Health &amp; Fitness ecosystem delivering personalized nutrition, workout splits, and calculators for sustainable transformations.
            </p>
          </div>

          {/* Newsletter */}
          <div className="sm:w-72 space-y-2">
            <span className="text-xs font-black text-foreground uppercase tracking-widest block">Weekly Fitness Newsletter</span>
            {subscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold py-2.5 px-4 rounded-xl">
                Welcome to the squad! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center bg-background dark:bg-card/50 border border-border/50 rounded-xl overflow-hidden px-2 py-1">
                <Mail className="w-4 h-4 text-muted ml-1 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-0 py-2 px-2 text-foreground text-sm focus:ring-0 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-lg cursor-pointer transition-all shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links: 2-col on mobile, 4-col on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-12 border-t border-border/10 pt-8">
          {/* AI Features */}
          <div className="space-y-3">
            <span className="text-xs font-black text-foreground uppercase tracking-widest block">AI Features</span>
            <ul className="space-y-2 text-xs">
              {footerLinks.features.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-muted hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                    <link.icon className="w-3 h-3 shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Calculators */}
          <div className="space-y-3">
            <span className="text-xs font-black text-foreground uppercase tracking-widest block">Tools</span>
            <ul className="space-y-2 text-xs">
              {footerLinks.calculators.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-muted hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <span className="text-xs font-black text-foreground uppercase tracking-widest block">Explore</span>
            <ul className="space-y-2 text-xs">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-muted hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <span className="text-xs font-black text-foreground uppercase tracking-widest block">Legal</span>
            <ul className="space-y-2 text-xs">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-muted hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/10 pt-6 space-y-3 text-xs text-muted text-center">
          <p className="leading-relaxed max-w-2xl mx-auto">
            Disclaimer: LeanVerse is an AI fitness resource. Generated plans are optimized estimates. Consult a physician before any intensive athletic or dietary changes.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} LeanVerse. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
