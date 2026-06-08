import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, User, Calendar, BookOpen, Tag } from 'lucide-react';
import AdContainer from '@/components/ads/AdContainer';
import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  await dbConnect();
  
  // Find the requested post
  const rawPost = await BlogPost.findOne({ slug, status: 'published' }).lean();
  
  if (!rawPost) {
    notFound();
  }

  // Format data
  const article = {
    title: rawPost.title,
    slug: rawPost.slug,
    category: rawPost.category || 'Fitness',
    tags: rawPost.tags || [],
    author: rawPost.author || 'LeanVerse Team',
    date: rawPost.publishedAt ? new Date(rawPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
    coverImage: rawPost.coverImage || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
    content: rawPost.content || ''
  };

  // Get related articles (fetch 2 random published)
  const relatedRaw = await BlogPost.find({ slug: { $ne: slug }, status: 'published' })
    .select('title slug category coverImage')
    .limit(2)
    .lean();

  const related = relatedRaw.map((r: any) => ({
    title: r.title,
    slug: r.slug,
    category: r.category || 'Article',
    coverImage: r.coverImage || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80'
  }));

  // Auto-generate TOC from Markdown headers (## or ###)
  const headings = article.content.split('\n')
    .filter((line: string) => /^#{2,3}\s/.test(line.trim()))
    .map((line: string) => line.trim().replace(/^#{2,3}\s/, '').trim());

  return (
    <article className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Return link */}
      <Link href="/blog" className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted hover:text-emerald-500 transition-colors mb-2 no-print">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Blog Listings</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full">{article.category}</span>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted">
          <span className="flex items-center"><User className="w-4 h-4 mr-1 text-muted" /> {article.author}</span>
          {article.date && <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-muted" /> {article.date}</span>}
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-muted" /> 5 min read</span>
        </div>
      </div>

      {/* Hero Banner Cover */}
      <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl no-print">
        <Image 
          src={article.coverImage} 
          alt={article.title}
          fill
          priority={true}
          sizes="(max-width: 768px) 100vw, 1024px"
          className="object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Main Core Body splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Blog Body text */}
        <div className="lg:col-span-8 space-y-6">
          <div className="w-full overflow-x-auto pb-4">
            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-muted dark:text-slate-350 space-y-5
                prose-h2:text-lg prose-h2:font-black prose-h2:text-foreground dark:prose-h2:text-slate-100 prose-h2:mt-6 prose-h2:mb-3
                prose-h3:text-sm prose-h3:font-black prose-h3:text-foreground dark:prose-h3:text-slate-150 prose-h3:mt-4 prose-h3:mb-2
                prose-p:mb-4
                prose-ol:list-decimal prose-ol:pl-5 prose-ol:space-y-1.5
                prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1.5
                prose-li:pl-1
                prose-img:rounded-2xl prose-img:border prose-img:border-border/10 prose-img:shadow-md
                prose-strong:font-extrabold prose-strong:text-slate-850 dark:prose-strong:text-slate-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Dynamic Ad container in middle of text */}
          <div className="border-t border-b border-border/10 py-4 my-8">
            <AdContainer slot="blog-article-inline" format="horizontal" />
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Table of Contents */}
            <div className="glass p-6 rounded-3xl border border-border/10 space-y-4">
              <div className="flex items-center space-x-2 border-b border-border/10 pb-3">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-muted uppercase tracking-widest block">Table of Contents</span>
              </div>
              <ul className="space-y-3 text-xs font-bold text-muted">
                {headings.length > 0 ? headings.map((h: string, i: number) => (
                  <li key={i} className="hover:text-emerald-500 cursor-pointer transition-colors line-clamp-1">{i+1}. {h}</li>
                )) : (
                  <li className="text-muted">No sections available</li>
                )}
              </ul>
            </div>

            {/* Square Ad slot */}
            <AdContainer slot="blog-article-sidebar" format="square" />
          </div>
        </div>
      </div>

      {/* Suggested related posts bottom */}
      <section className="border-t border-border/10 pt-10 mt-12 space-y-6">
        <h3 className="text-base font-black text-foreground">Related Articles You May Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {related.map((rel) => (
            <div key={rel.slug} className="glass p-5 rounded-2xl border border-border/10 flex items-start space-x-3.5 hover:border-emerald-500/20 transition-all">
              <div className="relative w-16 h-16 shrink-0">
                <Image src={rel.coverImage} alt={rel.title} fill sizes="64px" className="object-cover rounded-xl" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-muted font-extrabold uppercase">{rel.category}</span>
                <Link href={`/blog/${rel.slug}`} className="font-extrabold text-foreground text-xs hover:text-emerald-500 block line-clamp-2 leading-snug">
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
