import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, User, Calendar, BookOpen, Tag } from 'lucide-react';
import AdContainer from '@/components/ads/AdContainer';
import { Metadata } from 'next';

interface ArticleData {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  date: string;
  content: string;
}

const blogsDb: Record<string, ArticleData> = {
  'ultimate-indian-diet-plan-fat-loss': {
    title: 'The Ultimate Guide to Indian Diet Plans for Fat Loss',
    slug: 'ultimate-indian-diet-plan-fat-loss',
    summary: 'Struggling to hit your protein targets on a traditional Indian diet? Discover how to combine paneer, dal, chicken, and brown rice to shred fat sustainably.',
    category: 'Indian diet plans',
    tags: ['Weight loss', 'Indian diet plans', 'High protein'],
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    author: 'Dietitian Priya Patel',
    date: 'May 20, 2026',
    content: '<h2>Introduction to Healthy Fat Loss</h2><p>Losing body fat requires a persistent but moderate calorie deficit. On a typical South or North Indian diet, carbs can dominate our macro percentages. However, with deliberate tweaks, you can hit elite protein targets without exceeding your calorie limit.</p><h3>Key Macro Changes</h3><ol><li><strong>Dosa & Idli swaps:</strong> Standard rice idlis can be swapped for Oats Idli or Ragi Dosa to increase dietary fiber.</li><li><strong>Protein upgrades:</strong> Add paneer or boiled egg whites to your breakfast routines to improve satiety.</li><li><strong>Include Dals:</strong> While lentils provide fiber, combine them with standard whey isolate or lean meats to complete your amino acid profiles.</li></ol><h3>Example Macro Distribution</h3><p>Ensure that at least 30% of your daily calories come from protein. Tracking weight shifts consistently will guide whether your TDEE deficit is balanced.</p>',
  },
  'gym-workouts-perfect-push-pull-legs-split': {
    title: 'Gym Workouts: Designing a Perfect Push/Pull/Legs Split',
    slug: 'gym-workouts-perfect-push-pull-legs-split',
    summary: 'PPL is one of the most effective weekly training programs. Learn how to sequence movements to optimize muscle recovery and progressive overload.',
    category: 'Gym workouts',
    tags: ['Gym workouts', 'Hypertrophy', 'Strength'],
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    author: 'Coach Vikram Rathore',
    date: 'May 15, 2026',
    content: '<h2>What is a PPL Split?</h2><p>The Push/Pull/Legs training method splits your body by movement type. This ensures that muscle groups have ample rest (48-72 hours) while maximizing mechanical stress and hypertrophy.</p><h3>The Weekly Breakdown</h3><ul><li><strong>Push Day:</strong> Target Chest, Shoulders, and Triceps (e.g. Bench Press, Overhead Press, Cable Pressdowns).</li><li><strong>Pull Day:</strong> Target Back, Rear Delts, and Biceps (e.g. Lat Pulldowns, Barbell Rows, Hammer Curls).</li><li><strong>Legs Day:</strong> Target Quads, Hamstrings, Glutes, and Calves (e.g. Barbell Squats, Romanian Deadlifts, Calf Raises).</li></ul><h3>Applying Progressive Overload</h3><p>To grow, you must systematically increase the volume over time. Log your weights on our user dashboard to monitor weekly performance curves.</p>',
  },
  'home-workouts-fat-loss-minimal-equipment': {
    title: 'Home Workouts: How to Lose Fat with Minimal Equipment',
    slug: 'home-workouts-fat-loss-minimal-equipment',
    summary: 'No gym membership? No problem. Here is an intensive HIIT and bodyweight circuit designed to burn calories and build lean muscle in your living room.',
    category: 'Home workouts',
    tags: ['Home workouts', 'HIIT', 'Fat loss'],
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
    author: 'Trainer Sarah Jenkins',
    date: 'May 10, 2026',
    content: '<h2>Effective Home Workouts</h2><p>Home training relies on high relative intensity, short rest intervals, and complex body movements. You can accomplish elite cardio benchmarks and muscular endurance using just resistance bands and bodyweight.</p><h3>High-Intensity Home Circuit</h3><p>Perform each movement for 40 seconds followed by 20 seconds of rest. Complete 4 total rounds:</p><ol><li>Bodyweight Tempo Squats</li><li>Standard Push-Ups (or Incline Push-Ups)</li><li>Banded Lat Pulldowns or Door Rows</li><li>Glute Bridges</li><li>Bicycle Crunches</li></ol><h3>Hydration Tips</h3><p>Drink at least 500ml of water during this circuit to sustain cardiovascular output. Use our water intake log on the user dashboard to track your daily goals.</p>',
  },
};

export async function generateStaticParams() {
  return [
    { slug: 'ultimate-indian-diet-plan-fat-loss' },
    { slug: 'gym-workouts-perfect-push-pull-legs-split' },
    { slug: 'home-workouts-fat-loss-minimal-equipment' },
  ];
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = blogsDb[slug];

  if (!article) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Article not found</h2>
        <Link href="/blog" className="text-emerald-500 hover:underline">Back to all blogs</Link>
      </div>
    );
  }

  // Get related articles
  const related = Object.values(blogsDb).filter((b) => b.slug !== slug).slice(0, 2);

  return (
    <article className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Return link */}
      <Link href="/blog" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors mb-2 no-print">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Blog Listings</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full">{article.category}</span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center"><User className="w-4 h-4 mr-1 text-slate-400" /> {article.author}</span>
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400" /> {article.date}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-slate-400" /> 5 min read</span>
        </div>
      </div>

      {/* Hero Banner Cover */}
      <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/10 shadow-lg">
        <Image 
          src={article.coverImage} 
          alt={article.title} 
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover opacity-80"
        />
      </div>

      {/* Main Core Body splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Blog Body text */}
        <div className="lg:col-span-8 space-y-6">
          <div 
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-350 space-y-5
              prose-h2:text-lg prose-h2:font-black prose-h2:text-slate-800 dark:prose-h2:text-slate-100 prose-h2:mt-6 prose-h2:mb-3
              prose-h3:text-sm prose-h3:font-black prose-h3:text-slate-800 dark:prose-h3:text-slate-150 prose-h3:mt-4 prose-h3:mb-2
              prose-p:mb-4
              prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-1.5
              prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1.5
              prose-li:pl-1
              prose-strong:font-extrabold prose-strong:text-slate-850 dark:prose-strong:text-slate-200"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Dynamic Ad container in middle of text */}
          <div className="border-t border-b border-slate-200/10 py-4 my-8">
            <AdContainer slot="blog-article-inline" format="horizontal" />
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Table of Contents */}
            <div className="glass p-6 rounded-3xl border border-slate-200/10 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-3">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Table of Contents</span>
              </div>
              <ul className="space-y-3 text-xs font-bold text-slate-500">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">1. Introduction to Healthy Fat Loss</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">2. Key Macro Changes</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">3. Example Macro Distribution</li>
              </ul>
            </div>

            {/* Square Ad slot */}
            <AdContainer slot="blog-article-sidebar" format="square" />
          </div>
        </div>
      </div>

      {/* Suggested related posts bottom */}
      <section className="border-t border-slate-200/10 pt-10 mt-12 space-y-6">
        <h3 className="text-base font-black text-slate-800 dark:text-slate-100">Related Articles You May Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {related.map((rel) => (
            <div key={rel.slug} className="glass p-5 rounded-2xl border border-slate-200/10 flex items-start space-x-3.5 hover:border-emerald-500/20 transition-all">
              <div className="relative w-16 h-16 shrink-0">
                <Image src={rel.coverImage} alt={rel.title} fill sizes="64px" className="object-cover rounded-xl" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase">{rel.category}</span>
                <Link href={`/blog/${rel.slug}`} className="font-extrabold text-slate-800 dark:text-slate-100 text-xs hover:text-emerald-500 block line-clamp-2 leading-snug">
                  {rel.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
