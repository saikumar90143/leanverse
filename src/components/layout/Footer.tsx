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
 { name: 'AI Diet Planner', path: '/diet-planner', icon: Apple },
 { name: 'AI Workout Planner', path: '/workout-planner', icon: Dumbbell },
 { name: 'Fitness Recipes', path: '/recipes', icon: Heart },
 { name: 'Supplement Store', path: '/store', icon: Shield },
 ],
 calculators: [
 { name: 'BMI Calculator', path: '/calculators/bmi' },
 { name: 'Maintenance Calories', path: '/calculators/maintenance' },
 { name: 'Macro Calculator', path: '/calculators/macro' },
 { name: 'Body Fat Calculator', path: '/calculators/body-fat' },
 { name: 'Water Intake Calculator', path: '/calculators/water' },
 ],
 company: [
 { name: 'About Us', path: '/about' },
 { name: 'Contact Us', path: '/contact' },
 { name: 'Pricing Plans', path: '/pricing' },
 { name: 'Fitness Blog', path: '/blog' },
 ],
 };

 const pathname = usePathname();

 // Hide on admin routes
 if (pathname?.startsWith('/admin')) return null;

 return (
 <footer className="border-t border-border/10 dark:border-border bg-foreground text-muted py-16 no-print">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
 {/* Logo & Pitch */}
 <div className="lg:col-span-2 space-y-6">
 <Link href="/" className="flex items-center space-x-2">
 <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
 LEAN<span className="font-light text-slate-100">VERSE</span>
 </span>
 </Link>
 <p className="text-sm text-muted max-w-sm leading-relaxed">
 LeanVerse is an advanced AI-powered Health & Fitness ecosystem. We deliver personalized, instant nutrition schedules, workout split cards, and precise calculators to support sustainable habit transformations.
 </p>
 {/* Newsletter */}
 <div className="space-y-3">
 <span className="text-sm font-bold text-slate-200 block">Join Our Weekly Fitness Newsletter</span>
 {subscribed ? (
 <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold py-2.5 px-4 rounded-xl max-w-sm">
 Welcome to the squad! Keep checking your inbox.
 </div>
 ) : (
 <form onSubmit={handleSubscribe} className="flex max-w-sm items-center glass border border-slate-700 rounded-xl overflow-hidden px-2 py-1">
 <Mail className="w-4 h-4 text-muted ml-2" />
 <input
 type="email"
 placeholder="Enter your email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="w-full bg-transparent border-0 py-2 px-3 text-slate-200 text-sm focus:ring-0 focus:outline-none"
 />
 <button
 type="submit"
 className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer transition-all"
 >
 Subscribe
 </button>
 </form>
 )}
 </div>
 </div>

 {/* Feature Links */}
 <div className="space-y-4">
 <span className="text-sm font-black text-slate-200 uppercase tracking-widest block">AI Features</span>
 <ul className="space-y-2.5 text-sm">
 {footerLinks.features.map((link) => (
 <li key={link.path}>
 <Link href={link.path} className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
 <link.icon className="w-3.5 h-3.5" />
 <span>{link.name}</span>
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Calculators links */}
 <div className="space-y-4">
 <span className="text-sm font-black text-slate-200 uppercase tracking-widest block">Tools</span>
 <ul className="space-y-2.5 text-sm">
 {footerLinks.calculators.map((link) => (
 <li key={link.path}>
 <Link href={link.path} className="hover:text-cyan-400 transition-colors">
 {link.name}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Corporate links */}
 <div className="space-y-4">
 <span className="text-sm font-black text-slate-200 uppercase tracking-widest block">Explore</span>
 <ul className="space-y-2.5 text-sm">
 {footerLinks.company.map((link) => (
 <li key={link.path}>
 <Link href={link.path} className="hover:text-slate-200 transition-colors">
 {link.name}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 </div>

 {/* Ad Placement & Disclaimer */}
 <div className="border-t border-slate-800 mt-12 pt-8 text-center space-y-4 text-xs text-muted">
 <p className="max-w-3xl mx-auto leading-relaxed">
 Disclaimer: LeanVerse is an AI fitness resource. The generated plans, macros, and diet routines are optimized mathematical estimates. Consult with a qualified physician before initiating any intensive athletic or dietary changes.
 </p>
 <div className="flex justify-center space-x-6 flex-wrap gap-y-2">
 <span>© {new Date().getFullYear()} LeanVerse. All rights reserved.</span>
 <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
 <Link href="/terms" className="hover:underline">Terms of Service</Link>
 <Link href="/disclaimer" className="hover:underline">Medical Disclaimer</Link>
 </div>
 </div>
 </div>
 </footer>
 );
}
