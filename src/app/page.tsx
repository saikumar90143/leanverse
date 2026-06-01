'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, Dumbbell, ArrowRight, Calculator, 
  Star, ChevronDown, Flame, TrendingUp, Calendar
} from 'lucide-react';
import AdContainer from '@/components/ads/AdContainer';
import { getStreak, getLifetimeVolume, getUserLevel, getTodayWorkoutSummary } from '@/lib/gamification';

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  // Live dashboard data — loaded client-side to avoid SSR/hydration issues
  const [dashData, setDashData] = useState<{
    streak: number;
    levelName: string;
    levelEmoji: string;
    levelColor: string;
    workout: { name: string; completedSets: number; totalSets: number };
  } | null>(null);

  useEffect(() => {
    try {
      const vol = getLifetimeVolume();
      const level = getUserLevel(vol);
      const streak = getStreak();
      const workout = getTodayWorkoutSummary();
      setDashData({
        streak,
        levelName: level.name,
        levelEmoji: level.emoji,
        levelColor: level.color,
        workout,
      });
    } catch {
      // localStorage unavailable — leave dashData as null
    }
  }, []);

  // Daily motivational quotes
  const quotes = [
    "Discipline is the bridge between goals and accomplishment.",
    "No pain, no gain. Push through the discomfort.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Small steps every day lead to giant leaps over time.",
    "The only bad workout is the one that didn't happen.",
    "Eat clean. Train mean. Live lean.",
    "Results happen over time, not overnight. Stay consistent.",
  ];
  const todayQuote = quotes[new Date().getDay() % quotes.length];

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const greeting = getGreeting();
  const dateString = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const calcs = [
    { name: 'BMI Calculator', path: '/calculators/bmi', desc: 'Compute height-to-weight index.' },
    { name: 'TDEE Calories', path: '/calculators/maintenance', desc: 'Find daily maintenance burn.' },
    { name: 'Macro Splitter', path: '/calculators/macro', desc: 'Divide macros by specific goal.' },
    { name: 'Navy Body Fat', path: '/calculators/body-fat', desc: 'Calculate fat percentage.' },
    { name: 'Water Hydrator', path: '/calculators/water', desc: 'Track daily hydration volume.' },
  ];

  const staticBlogs = [
    {
      title: 'The Ultimate Guide to Indian Diet Plans for Fat Loss',
      slug: 'ultimate-indian-diet-plan-fat-loss',
      summary: 'Struggling to hit your protein targets on a traditional Indian diet? Discover how to combine paneer, dal, chicken, and brown rice to shred fat sustainably.',
      category: 'Indian diet plans',
      coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    },
    {
      title: 'Gym Workouts: Designing a Perfect Push/Pull/Legs Split',
      slug: 'gym-workouts-perfect-push-pull-legs-split',
      summary: 'PPL is one of the most effective weekly training programs. Learn how to sequence movements to optimize muscle recovery and progressive overload.',
      category: 'Gym workouts',
      coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How does LeanVerse generate customized diet plans?',
      a: 'LeanVerse utilizes mathematical biometrics (Mifflin-St Jeor and TDEE formulas) adjusted for your food preferences (e.g., South Indian, keto, high-protein) and home food pickers. This allows our AI algorithm to build complete daily meal timings, macro limits, and custom grocery lists.',
    },
    {
      q: 'Can I track my progressive overload and workouts here?',
      a: 'Absolutely! Our AI Workout Planner creates specific day-split exercise cards (sets, reps, rest periods). You can record weights on the planner or use the User Dashboard weight tracker graphs to monitor performance over time.',
    },
    {
      q: 'Is there a fee for using LeanVerse?',
      a: 'LeanVerse offers a comprehensive Free tier containing fully-functional fitness calculators, standard blog CMS, and basic AI generators. To unlock unlimited PDF downloads, ad-free UI, and advanced AI chatbot tracking, explore our premium pricing plans.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-bold text-xs shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Next-Generation Fitness Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-800 dark:text-slate-100 leading-[1.08] tracking-tight">
            Transform Your Body <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              With Smart AI
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            LeanVerse combines advanced biometrics, custom meal schedules, structured workout cards, and precise organic analytics to help you build sustainable daily health habits.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link 
              href="/diet-planner"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-sm transition-all shadow-xl hover:shadow-emerald-500/20 text-center flex items-center justify-center space-x-1.5 active:scale-97 cursor-pointer"
            >
              <span>Generate My Diet Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/workout-planner"
              className="px-8 py-4 rounded-2xl bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all border border-slate-350/15 text-center flex items-center justify-center cursor-pointer"
            >
              <span>Build Gym Split</span>
            </Link>
          </div>
        </div>

        {/* Hero Interactive — Premium Today Dashboard */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] max-w-[100vw] h-[350px] bg-emerald-500/10 rounded-full blur-[80px] -z-10 transition-all duration-700 group-hover:bg-cyan-500/10 group-hover:scale-110 pointer-events-none overflow-hidden" />
          
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-white/10 shadow-2xl space-y-6 w-full max-w-md mx-auto relative overflow-hidden transition-all duration-500 hover:shadow-emerald-500/10 hover:border-emerald-500/20">
            {/* Header / Greeting */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{greeting}, Athlete</h2>
                <div className="flex items-center space-x-1.5 mt-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{dateString}</span>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Streak & Level Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 hover:bg-orange-500/5 transition-colors group/streak">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${dashData && dashData.streak > 0 ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Streak</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {dashData?.streak ?? 0} <span className="text-sm font-bold text-slate-400">Days</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 hover:bg-cyan-500/5 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-500">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Rank</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl">{dashData?.levelEmoji ?? '🌱'}</span>
                  <span className={`text-sm font-black ${dashData?.levelColor ?? 'text-emerald-500'}`}>
                    {dashData?.levelName ?? 'Beginner'}
                  </span>
                </div>
              </div>
            </div>

            {/* Today's Workout Progress */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-500" /> Today's Workout
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {dashData?.workout.completedSets ?? 0} / {dashData?.workout.totalSets ?? 0} Sets
                </span>
              </div>
              
              <div>
                <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200 block truncate mb-2">
                  {dashData?.workout.name ?? 'No workout logged today'}
                </span>
                
                <div className="relative w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.round(((dashData?.workout.completedSets ?? 0) / (dashData?.workout.totalSets ?? 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <Link href="/workout-tracker" className="block w-full py-2.5 mt-2 bg-slate-800 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black text-center transition-colors shadow-md">
                {(dashData?.workout.totalSets ?? 0) > 0 ? 'Resume Workout' : 'Start New Workout'}
              </Link>
            </div>

            {/* Daily Quote */}
            <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 rounded-2xl border border-emerald-500/10">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">"{todayQuote}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad slot */}
      <AdContainer slot="home-hero-bottom" format="horizontal" />

      {/* 2. CALCULATORS SUITE grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Interactive Tools</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Fitness Calculators Directory
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">Instantly calculate your health status, macro breakdown target and daily BMR fluid benchmarks.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {calcs.map((c) => (
            <Link 
              key={c.name}
              href={c.path}
              className="glass p-5 rounded-2xl border border-slate-200/10 hover:border-emerald-500/20 text-center space-y-2 block hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-slate-850 dark:text-slate-200 block">{c.name}</span>
              <span className="text-[10px] text-slate-500 block leading-tight">{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TESTIMONIALS SLIDER SECTION */}
      <section className="bg-slate-200/30 dark:bg-slate-900/40 py-16 border-t border-b border-slate-250/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">Success Stories</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 leading-tight">
              Real Transformations <br />
              Powered by LeanVerse
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Discover how hundreds of members optimized their caloric splits and progressive gym loading routines using our AI blueprint tools.
            </p>

            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current text-amber-400" />)}
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 ml-2">4.9 / 5 Rating (3,500+ members)</span>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-slate-200/10 space-y-4 relative overflow-hidden">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold block">Member Review</span>
            <p className="text-sm italic text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              "Being on an Indian vegetarian diet, hitting 140g of protein felt impossible. LeanVerse’s AI Diet Planner automatically suggested low-fat paneer and egg-white alternatives and calculated my exact macro split. Shredded 8kg in 12 weeks!"
            </p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200/10">
              <div>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 block">Karan Malhotra</span>
                <span className="text-[10px] text-emerald-500 block">Lean Bulk Program Member</span>
              </div>
              <span className="text-xs font-black text-slate-400 font-mono">12 weeks shift</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLOGS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-slate-250/10 pb-4">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Knowledge Feed</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Trending Fitness Studies</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-emerald-500 hover:underline flex items-center space-x-1">
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staticBlogs.map((b) => (
            <div key={b.slug} className="glass rounded-3xl overflow-hidden border border-slate-200/10 shadow-lg flex flex-col justify-between glow-card">
              <div className="relative w-full h-44 overflow-hidden bg-slate-800">
                <Image src={b.coverImage} alt={b.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-80" />
                <span className="absolute top-3 left-3 text-[9px] font-black uppercase bg-slate-900/80 text-white px-2 py-0.5 rounded-md">
                  {b.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm leading-snug">{b.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{b.summary}</p>
              </div>
              <div className="px-5 pb-5 pt-2 flex justify-end">
                <Link href={`/blog/${b.slug}`} className="text-xs font-black text-emerald-500 hover:text-emerald-400 flex items-center">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ACCORDION FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Support Desk</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const open = !!faqOpen[idx];
            return (
              <div key={idx} className="glass rounded-2xl border border-slate-200/10 overflow-hidden transition-all">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left font-extrabold text-sm text-slate-850 dark:text-slate-200 hover:bg-slate-200/10 dark:hover:bg-white/5 flex justify-between items-center cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
