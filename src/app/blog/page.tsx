'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock, ChevronRight, Apple, Dumbbell, Shield, Sparkles } from 'lucide-react';
import AdContainer from '@/components/ads/AdContainer';

interface Article {
 title: string;
 slug: string;
 summary: string;
 category: string;
 tags: string[];
 coverImage: string;
 author: string;
 date: string;
}

export default function BlogListingPage() {
 const [search, setSearch] = useState('');
 const [activeCategory, setActiveCategory] = useState('all');

 const [blogs, setBlogs] = useState<Article[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetch('/api/blogs')
 .then(res => res.json())
 .then(data => {
 if (data.success && data.posts) {
 // Format date for display
 const formatted = data.posts.map((p: any) => ({
 ...p,
 date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
 : new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
 coverImage: p.coverImage || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
 tags: p.tags || [],
 author: p.author || 'LeanVerse Team'
 }));
 setBlogs(formatted);
 }
 setLoading(false);
 })
 .catch(err => {
 console.error('Error fetching blogs:', err);
 setLoading(false);
 });
 }, []);

  const uniqueCategories = Array.from(new Set(blogs.map(b => b.category))).filter(Boolean);
  const categories = [
    { id: 'all', name: 'All Categories' },
    ...uniqueCategories.map(cat => ({ id: cat, name: cat }))
  ];

  const filteredArticles = blogs.filter((art) => {
    const matchesSearch = art.title?.toLowerCase().includes(search.toLowerCase()) || 
                          art.summary?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

 return (
 <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
 {/* Banner */}
 <div className="text-center max-w-xl mx-auto space-y-2">
 <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block">LeanVerse Knowledge Hub</span>
 <h1 className="text-3xl font-black text-foreground flex items-center justify-center">
 Organic Fitness Articles
 <Sparkles className="w-5.5 h-5.5 ml-1.5 text-emerald-400" />
 </h1>
 <p className="text-xs text-muted">Read scientifically-backed studies on calorie deficits, keto recipes, gym splits, and supplement comparisons.</p>
 </div>

 {/* Search and Category selectors */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-6">
 <div className="flex flex-wrap gap-1.5">
 {categories.map((cat) => (
 <button
 key={cat.id}
 onClick={() => setActiveCategory(cat.id)}
 className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
 activeCategory === cat.id
 ? 'bg-emerald-500 text-white shadow-md'
 : 'text-muted bg-secondary/50 dark:bg-card/5 hover:text-foreground dark:hover:text-slate-200'
 }`}
 >
 {cat.name}
 </button>
 ))}
 </div>

 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
 <input
 type="text"
 placeholder="Search articles..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="bg-secondary/50 dark:bg-card/5 border border-slate-350/15 dark:border-border rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 text-foreground font-bold"
 />
 </div>
 </div>

 {/* Grid containing blogs and a sidebar Ad */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 <div className="lg:col-span-8 space-y-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 {loading ? (
 <div className="text-center py-12">
 <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
 <p className="text-muted text-sm font-bold">Loading articles...</p>
 </div>
 ) : filteredArticles.length === 0 ? (
 <div className="col-span-2 text-center py-12 border-2 border-dashed border-border/50 rounded-3xl">
 <p className="text-muted text-sm font-bold">No articles found matching your criteria.</p>
 </div>
 ) : (
 filteredArticles.map((art) => (
 <article key={art.slug} className="glass rounded-3xl overflow-hidden border border-border/10 shadow-lg flex flex-col justify-between glow-card">
 <div>
 {/* Cover Image */}
 <div className="relative w-full h-44 overflow-hidden bg-foreground">
 <Image 
 src={art.coverImage} 
 alt={art.title}
 fill
 sizes="(max-width: 768px) 100vw, 33vw"
 className="object-cover opacity-80 hover:scale-105 transition-transform duration-500" 
 />
 <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider bg-foreground/20 text-white px-2 py-0.5 rounded-md backdrop-blur-sm">
 {art.category}
 </span>
 </div>
 {/* Info */}
 <div className="p-5 space-y-2">
 <span className="text-[10px] text-muted font-bold block">{art.date} • {art.author}</span>
 <h3 className="font-extrabold text-foreground text-sm leading-snug">{art.title}</h3>
 <p className="text-xs text-muted leading-relaxed line-clamp-2">{art.summary}</p>
 </div>
 </div>

 <div className="px-5 pb-5 pt-2 border-t border-border/10 flex justify-between items-center text-xs">
 <div className="flex space-x-1.5">
 {art.tags && art.tags.slice(0, 2).map((t) => (
 <span key={t} className="text-[9px] text-muted font-bold">#{t}</span>
 ))}
 </div>
 <Link href={`/blog/${art.slug}`} className="font-black text-emerald-500 hover:text-emerald-400 transition-colors flex items-center">
 <span>Read Article</span>
 <ChevronRight className="w-3.5 h-3.5" />
 </Link>
 </div>
 </article>
 ))
 )}
 </div>

 {/* Ad container inline */}
 <AdContainer slot="blog-listing-horizontal" format="horizontal" />
 </div>

 {/* Sidebar ads and featured links */}
 <div className="lg:col-span-4 space-y-6">
 {/* Ad slot */}
 <div className="sticky top-24 space-y-6">
 <AdContainer slot="blog-listing-square" format="square" />
 
 {/* Quick newsletter call */}
 <div className="glass p-6 rounded-3xl border border-border/10 space-y-3">
 <span className="text-xs font-black text-muted uppercase tracking-widest block">Premium Upgrades</span>
 <p className="text-xs text-muted leading-relaxed font-semibold">Tired of Sponsored Ads? Upgrade to LeanVerse Premium today and get ad-free AI generations.</p>
 <Link href="/pricing" className="block w-full py-2.5 text-center bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95">Upgrade to Premium</Link>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
