'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle, Clock, FileText, X, Calendar, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';

interface BlogPost {
 _id: string;
 title: string;
 slug: string;
 summary: string;
 content: string;
 category: string;
 status: 'draft' | 'scheduled' | 'published';
 author: string;
 views: number;
 metaTitle: string;
 metaDescription: string;
 keywords: string[];
 tags: string[];
 scheduledAt?: string;
 createdAt: string;
 coverImage?: string;
}

const CATEGORIES = ['Indian Diet', 'Gym Workout', 'Home Workout', 'Supplements', 'Fat Loss', 'Muscle Gain', 'Yoga', 'Mental Health', 'Nutrition Science'];

const statusColors: Record<string, string> = {
 draft: 'bg-background0/10 text-muted border-slate-500/20',
 scheduled: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
 published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

const emptyPost = (): Partial<BlogPost> => ({
 title: '', slug: '', summary: '', content: '', category: 'Indian Diet',
 status: 'draft', author: 'LeanVerse AI Team', metaTitle: '', metaDescription: '',
 keywords: [], tags: [], coverImage: ''
});

export default function BlogSection() {
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [total, setTotal] = useState(0);
 const [loading, setLoading] = useState(true);
 const [statusFilter, setStatusFilter] = useState('');
 const [search, setSearch] = useState('');
 const [showEditor, setShowEditor] = useState(false);
 const [showAIGen, setShowAIGen] = useState(false);
 const [aiLoading, setAiLoading] = useState(false);
 const [aiParams, setAiParams] = useState({ topic: '', audience: '', goal: '', tone: '' });
 const [editing, setEditing] = useState<Partial<BlogPost>>(emptyPost());
 const [saving, setSaving] = useState(false);
 const [page, setPage] = useState(1);
 const [pages, setPages] = useState(1);
 const [uploadingImage, setUploadingImage] = useState(false);

 const fetchPosts = useCallback(async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams({ page: String(page), limit: '15' });
 if (statusFilter) params.set('status', statusFilter);
 if (search) params.set('search', search);
 const res = await fetch(`/api/admin/blogs?${params}`);
 const data = await res.json();
 setPosts(data.posts || []);
 setTotal(data.total || 0);
 setPages(data.pages || 1);
 } catch {}
 setLoading(false);
 }, [page, statusFilter, search]);

 useEffect(() => { fetchPosts(); }, [fetchPosts]);

 const savePost = async () => {
 setSaving(true);
 try {
 const method = editing._id ? 'PATCH' : 'POST';
 const res = await fetch('/api/admin/blogs', {
 method,
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(editing._id ? { id: editing._id, ...editing } : editing),
 });
 if (res.ok) {
 setShowEditor(false);
 setEditing(emptyPost());
 await fetchPosts();
 } else {
 const data = await res.json().catch(() => ({}));
 alert(`Failed to save post: ${data.error || 'Unknown error'}`);
 }
 } catch (err: any) {
 alert(`Network error: ${err.message}`);
 }
 setSaving(false);
 };

 const deletePost = async (id: string) => {
 if (!confirm('Delete this post?')) return;
 await fetch('/api/admin/blogs', {
 method: 'DELETE',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id }),
 });
 fetchPosts();
 };

 const quickPublish = async (post: BlogPost) => {
 await fetch('/api/admin/blogs', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ id: post._id, status: 'published' }),
 });
 fetchPosts();
 };

 const openEdit = (post: BlogPost) => {
 setEditing(post);
 setShowEditor(true);
 };

  const handleImageUploadSuccess = (url: string) => {
    const imageMarkdown = `\n![Image](${url})\n`;
    setEditing(p => ({ ...p, content: (p.content || '') + imageMarkdown }));
  };

 const handleGenerateAI = async () => {
 if (!aiParams.topic) return alert('Topic is required');
 setAiLoading(true);
 try {
 const res = await fetch('/api/admin/blogs/generate', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 topic: aiParams.topic,
 category: editing.category || 'Fitness',
 audience: aiParams.audience,
 goal: aiParams.goal,
 tone: aiParams.tone,
 })
 });
 const data = await res.json();
 if (data.success && data.post) {
 setEditing(prev => ({
 ...prev,
 title: data.post.title || prev.title,
 slug: data.post.slug || prev.slug,
 summary: data.post.summary || prev.summary,
 content: data.post.content || prev.content,
 metaTitle: data.post.metaTitle || prev.metaTitle,
 metaDescription: data.post.metaDescription || prev.metaDescription,
 }));
 setShowAIGen(false);
 } else {
 alert(data.error || 'Failed to generate content');
 }
 } catch (err: any) {
 alert('Error generating content: ' + err.message);
 }
 setAiLoading(false);
 };

 return (
 <div className="space-y-5">
 {/* Header */}
 <div className="flex flex-wrap gap-3 items-center justify-between">
 <div className="flex gap-3 flex-1">
 <div className="relative flex-1 min-w-52">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
 <input
 type="text"
 placeholder="Search posts..."
 value={search}
 onChange={(e) => { setSearch(e.target.value); setPage(1); }}
 className="w-full pl-9 pr-4 py-2.5 bg-card/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs focus:outline-none focus:border-emerald-500"
 />
 </div>
 <select
 value={statusFilter}
 onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
 className="px-3 py-2.5 bg-card/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs font-bold focus:outline-none"
 >
 <option value="">All Statuses</option>
 <option value="draft">Draft</option>
 <option value="scheduled">Scheduled</option>
 <option value="published">Published</option>
 </select>
 </div>
 <button
 onClick={() => { setEditing(emptyPost()); setShowEditor(true); }}
 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold rounded-xl shadow-md hover:from-emerald-400 hover:to-cyan-400 transition-all"
 >
 <Plus className="w-3.5 h-3.5" /> New Post
 </button>
 </div>

 {/* Stats row */}
 <div className="grid grid-cols-3 gap-4">
 {[
 { label: 'Total Posts', value: total, icon: FileText, color: 'text-blue-500' },
 { label: 'Published', value: posts.filter(p => p.status === 'published').length, icon: CheckCircle, color: 'text-emerald-500' },
 { label: 'Scheduled', value: posts.filter(p => p.status === 'scheduled').length, icon: Calendar, color: 'text-amber-500' },
 ].map((s) => (
 <div key={s.label} className="glass rounded-2xl p-4 border border-border/10 dark:border-border flex items-center gap-3">
 <s.icon className={`w-5 h-5 ${s.color}`} />
 <div>
 <p className="text-[10px] text-muted font-bold">{s.label}</p>
 <p className="text-lg font-black text-foreground">{s.value}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Posts table */}
 <div className="glass rounded-2xl border border-border/10 dark:border-border overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="border-b border-border/10 dark:border-border bg-background/50 dark:bg-card/2">
 <th className="text-left px-4 py-3 font-black text-muted">Title</th>
 <th className="text-left px-4 py-3 font-black text-muted">Category</th>
 <th className="text-left px-4 py-3 font-black text-muted">Status</th>
 <th className="text-left px-4 py-3 font-black text-muted">Views</th>
 <th className="text-left px-4 py-3 font-black text-muted">Date</th>
 <th className="px-4 py-3" />
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
 {loading ? (
 <tr><td colSpan={6} className="text-center py-10 text-muted">Loading...</td></tr>
 ) : posts.length === 0 ? (
 <tr><td colSpan={6} className="text-center py-10 text-muted">
 No posts yet. <button onClick={() => { setEditing(emptyPost()); setShowEditor(true); }} className="text-emerald-500 underline">Create your first post!</button>
 </td></tr>
 ) : posts.map((p) => (
 <tr key={p._id} className="hover:bg-background/30 dark:hover:bg-card/3">
 <td className="px-4 py-3">
 <p className="font-bold text-foreground max-w-52 truncate">{p.title}</p>
 <p className="text-muted text-[10px] font-mono">/{p.slug}</p>
 </td>
 <td className="px-4 py-3 text-muted ">{p.category}</td>
 <td className="px-4 py-3">
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusColors[p.status]}`}>{p.status}</span>
 </td>
 <td className="px-4 py-3 text-muted">{p.views?.toLocaleString() ?? 0}</td>
 <td className="px-4 py-3 text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-1.5">
 {p.status !== 'published' && (
 <button onClick={() => quickPublish(p)} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Publish">
 <CheckCircle className="w-3.5 h-3.5" />
 </button>
 )}
 <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
 <Edit2 className="w-3.5 h-3.5" />
 </button>
 <button onClick={() => deletePost(p._id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Blog Editor Modal */}
 {showEditor && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-black/60" onClick={() => setShowEditor(false)} />
 <div className="relative w-full max-w-3xl bg-card rounded-3xl shadow-2xl border border-border/20 dark:border-border overflow-hidden max-h-[90vh] flex flex-col">
 <div className="flex items-center justify-between p-6 border-b border-border/10 dark:border-border">
 <div className="flex items-center gap-4">
 <h3 className="font-black text-foreground">{editing._id ? 'Edit Post' : 'New Blog Post'}</h3>
 {!editing._id && (
 <button 
 onClick={() => setShowAIGen(true)}
 className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-500 border border-violet-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider hover:from-violet-500/20 hover:to-fuchsia-500/20 transition-all"
 >
 <Sparkles className="w-3 h-3" /> Auto-Generate
 </button>
 )}
 </div>
 <button onClick={() => setShowEditor(false)}><X className="w-5 h-5 text-muted" /></button>
 </div>
 <div className="overflow-y-auto p-6 space-y-4 flex-1">
 <div className="grid grid-cols-2 gap-4">
 <div className="col-span-2">
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Title *</label>
 <input
 value={editing.title || ''}
 onChange={(e) => {
 const title = e.target.value;
 const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
 setEditing(p => ({ ...p, title, slug }));
 }}
 placeholder="e.g. 5 Best Protein Sources for Vegetarians"
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500"
 />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Slug</label>
 <input value={editing.slug || ''} readOnly className="w-full px-3 py-2.5 bg-secondary/30 dark:bg-card/3 border border-border/10 dark:border-border rounded-xl text-xs font-mono text-muted" />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Category</label>
 <select
 value={editing.category || 'Indian Diet'}
 onChange={(e) => setEditing(p => ({ ...p, category: e.target.value }))}
 className="w-full px-3 py-2.5 bg-secondary/50 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none"
 >
 {CATEGORIES.map(c => <option key={c}>{c}</option>)}
 </select>
 </div>
  <div className="col-span-2">
    <label className="text-[10px] font-black text-muted uppercase block mb-1">Cover Image</label>
    <div className="flex items-center gap-4 p-3 bg-background dark:bg-card/5 border border-border/20 dark:border-border rounded-xl">
      {editing.coverImage ? (
        <div className="relative group">
          <img src={editing.coverImage} alt="Cover Preview" className="w-16 h-16 rounded-lg object-cover bg-card" />
          <button 
            onClick={() => setEditing((p: any) => ({ ...p, coverImage: '' }))}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg bg-secondary dark:bg-card/10 flex items-center justify-center">
          <span className="text-[10px] text-muted">No Cover</span>
        </div>
      )}
      <div className="flex-1">
        <ImageUploader 
          onUploadSuccess={(url) => setEditing((p: any) => ({ ...p, coverImage: url }))}
        >
          <button type="button" className="w-full text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl transition-all">
            Upload Cover Banner
          </button>
        </ImageUploader>
      </div>
    </div>
  </div>
  <div className="col-span-2">
    <label className="text-[10px] font-black text-muted uppercase block mb-1">Summary *</label>
    <textarea
      rows={2}
      value={editing.summary || ''}
      onChange={(e) => setEditing(p => ({ ...p, summary: e.target.value }))}
      placeholder="Brief description shown in blog listings..."
      className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none"
    />
  </div>
 <div className="col-span-2">
 <div className="flex justify-between items-center mb-1">
 <label className="text-[10px] font-black text-muted uppercase">Content (Markdown)</label>
 
                <ImageUploader 
                  onUploadSuccess={handleImageUploadSuccess}
                >
                  <button 
                    type="button" 
                    className="flex items-center gap-1.5 px-2 py-1 bg-secondary dark:bg-card/5 hover:bg-secondary dark:hover:bg-card/10 rounded-lg text-xs font-bold text-muted transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Insert Image
                  </button>
                </ImageUploader>
 </div>
 <textarea
 rows={8}
 value={editing.content || ''}
 onChange={(e) => setEditing(p => ({ ...p, content: e.target.value }))}
 placeholder="Write your full article here in Markdown..."
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none font-mono"
 />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Meta Title (SEO)</label>
 <input
 value={editing.metaTitle || ''}
 onChange={(e) => setEditing(p => ({ ...p, metaTitle: e.target.value }))}
 placeholder="60 chars max"
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs focus:outline-none focus:border-emerald-500"
 />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Status</label>
 <select
 value={editing.status || 'draft'}
 onChange={(e) => setEditing(p => ({ ...p, status: e.target.value as any }))}
 className="w-full px-3 py-2.5 bg-secondary/50 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none"
 >
 <option value="draft">Draft</option>
 <option value="scheduled">Scheduled</option>
 <option value="published">Published</option>
 </select>
 </div>
 <div className="col-span-2">
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Meta Description (SEO)</label>
 <textarea
 rows={2}
 value={editing.metaDescription || ''}
 onChange={(e) => setEditing(p => ({ ...p, metaDescription: e.target.value }))}
 placeholder="160 chars max — describe this article for search engines"
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs focus:outline-none focus:border-emerald-500 resize-none"
 />
 </div>
 </div>
 </div>
 <div className="p-6 border-t border-border/10 dark:border-border flex justify-end gap-3">
 <button onClick={() => setShowEditor(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-secondary dark:bg-card/5 text-muted hover:bg-secondary dark:hover:bg-card/10">Cancel</button>
 <button onClick={savePost} disabled={saving || !editing.title || !editing.summary} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white disabled:opacity-50">
 {saving ? 'Saving...' : editing._id ? 'Update Post' : 'Create Post'}
 </button>
 </div>

 {/* AI Generator Overlay */}
 {showAIGen && (
 <div className="absolute inset-0 z-10 bg-card/95 /95 backdrop-blur-sm flex flex-col p-6">
 <div className="flex justify-between items-center mb-6">
 <h4 className="font-black text-violet-500 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Generate Blog Post</h4>
 <button onClick={() => setShowAIGen(false)}><X className="w-5 h-5 text-muted" /></button>
 </div>
 
 <div className="space-y-4 flex-1 overflow-y-auto pr-2">
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Blog Topic (Be specific) *</label>
 <input 
 value={aiParams.topic} 
 onChange={e => setAiParams(p => ({...p, topic: e.target.value}))}
 placeholder="e.g. How to do a proper pushup for beginners"
 className="w-full px-4 py-3 bg-secondary dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm"
 />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Target Audience</label>
 <input 
 value={aiParams.audience} 
 onChange={e => setAiParams(p => ({...p, audience: e.target.value}))}
 placeholder="e.g. Beginners, Athletes, Seniors..."
 className="w-full px-4 py-3 bg-secondary dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm"
 />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Tone</label>
 <input 
 value={aiParams.tone} 
 onChange={e => setAiParams(p => ({...p, tone: e.target.value}))}
 placeholder="e.g. Professional, Fun, Motivational..."
 className="w-full px-4 py-3 bg-secondary dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm"
 />
 </div>
 </div>

 <div className="mt-4 pt-4 border-t border-border/10 dark:border-border flex justify-end gap-3">
 <button onClick={() => setShowAIGen(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-muted">Cancel</button>
 <button 
 onClick={handleGenerateAI}
 disabled={aiLoading || !aiParams.topic}
 className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white disabled:opacity-50"
 >
 {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
 {aiLoading ? 'Generating content (takes 10-20s)...' : 'Generate Article'}
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 );
}
