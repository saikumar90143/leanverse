'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, X, Filter } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';

interface Exercise {
 _id: string;
 name: string;
 muscleGroup: string;
 equipment: string;
 difficulty: string[];
 category: string;
 caloriesPerMinute: number;
 usageCount: number;
 avgRating: number;
 instructions: string;
 homeVersion: string;
 gymVersion: string;
 imageUrl?: string;
 recommendedSets?: { min: number; max: number };
 recommendedReps?: { min: number; max: number };
 recommendedRestSeconds?: number;
}

const MUSCLES = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs', 'Forearms', 'Glutes', 'Calves', 'Full Body', 'Cardio'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const EQUIPMENT = ['Barbell', 'Dumbbell', 'Kettlebell', 'Cable', 'Machine', 'Bodyweight', 'Resistance Band', 'None'];
const CATEGORIES = ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Yoga', 'Mobility'];

const diffColors: Record<string, string> = {
 Beginner: 'bg-emerald-500/10 text-emerald-500',
 Intermediate: 'bg-amber-500/10 text-amber-500',
 Advanced: 'bg-rose-500/10 text-rose-500',
};

const empty = () => ({
 name: '', muscleGroup: 'Chest', equipment: 'Barbell', difficulty: ['Beginner'],
 category: 'Strength', caloriesPerMinute: 6, instructions: [], homeVersion: '', gymVersion: '', imageUrl: '',
 recommendedSets: { min: 3, max: 4 },
 recommendedReps: { min: 8, max: 12 },
 recommendedRestSeconds: 60,
});

export default function ExercisesSection() {
 const [exercises, setExercises] = useState<Exercise[]>([]);
 const [total, setTotal] = useState(0);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [muscleFilter, setMuscleFilter] = useState('');
 const [diffFilter, setDiffFilter] = useState('');
 const [page, setPage] = useState(1);
 const [pages, setPages] = useState(1);
 const [showModal, setShowModal] = useState(false);
 const [editing, setEditing] = useState<any>(empty());
 const [saving, setSaving] = useState(false);

 const fetch_ = useCallback(async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams({ page: String(page), limit: '15' });
 if (search) params.set('search', search);
 if (muscleFilter) params.set('muscle', muscleFilter);
 if (diffFilter) params.set('difficulty', diffFilter);
 const res = await fetch(`/api/admin/exercises?${params}`);
 const data = await res.json();
 setExercises(data.exercises || []);
 setTotal(data.total || 0);
 setPages(data.pages || 1);
 } catch {}
 setLoading(false);
 }, [page, search, muscleFilter, diffFilter]);

 useEffect(() => { fetch_(); }, [fetch_]);

 const save = async () => {
 setSaving(true);
 try {
 const method = editing._id ? 'PATCH' : 'POST';
 const res = await fetch('/api/admin/exercises', {
 method,
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(editing._id ? { id: editing._id, ...editing } : editing),
 });
 if (res.ok) { setShowModal(false); setEditing(empty()); fetch_(); }
 } catch {}
 setSaving(false);
 };

 const del = async (id: string) => {
 if (!confirm('Delete this exercise?')) return;
 await fetch('/api/admin/exercises', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
 fetch_();
 };

 return (
 <div className="space-y-5">
 {/* Filters */}
 <div className="flex flex-wrap gap-3">
 <div className="relative flex-1 min-w-48">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
 <input type="text" placeholder="Search exercises..." value={search}
 onChange={(e) => { setSearch(e.target.value); setPage(1); }}
 className="w-full pl-9 pr-4 py-2.5 bg-card/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs focus:outline-none focus:border-emerald-500"
 />
 </div>
 <select value={muscleFilter} onChange={(e) => { setMuscleFilter(e.target.value); setPage(1); }}
 className="px-3 py-2.5 bg-card/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs font-bold focus:outline-none">
 <option value="">All Muscles</option>
 {MUSCLES.map(m => <option key={m}>{m}</option>)}
 </select>
 <select value={diffFilter} onChange={(e) => { setDiffFilter(e.target.value); setPage(1); }}
 className="px-3 py-2.5 bg-card/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-xs font-bold focus:outline-none">
 <option value="">All Difficulties</option>
 {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
 </select>
 <button onClick={() => { setEditing(empty()); setShowModal(true); }}
 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold rounded-xl shadow-md ml-auto">
 <Plus className="w-3.5 h-3.5" /> Add Exercise
 </button>
 </div>

 <p className="text-xs text-muted font-bold">{total.toLocaleString()} exercises in database</p>

 {/* Table */}
 <div className="glass rounded-2xl border border-border/10 dark:border-border overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="border-b border-border/10 dark:border-border bg-background/50 dark:bg-card/2">
 <th className="text-left px-4 py-3 font-black text-muted">Exercise</th>
 <th className="text-left px-4 py-3 font-black text-muted">Muscle</th>
 <th className="text-left px-4 py-3 font-black text-muted">Equipment</th>
 <th className="text-left px-4 py-3 font-black text-muted">Difficulty</th>
 <th className="text-left px-4 py-3 font-black text-muted">Cal/min</th>
 <th className="text-left px-4 py-3 font-black text-muted">Uses</th>
 <th className="px-4 py-3" />
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
 {loading ? (
 <tr><td colSpan={7} className="text-center py-10 text-muted">Loading...</td></tr>
 ) : exercises.length === 0 ? (
 <tr><td colSpan={7} className="text-center py-10 text-muted">
 No exercises yet. <button onClick={() => { setEditing(empty()); setShowModal(true); }} className="text-emerald-500 underline">Add the first one!</button>
 </td></tr>
 ) : exercises.map((ex) => (
 <tr key={ex._id} className="hover:bg-background/30 dark:hover:bg-card/3">
 <td className="px-4 py-3">
 <div className="flex items-center gap-3">
 {ex.imageUrl ? (
 <img src={ex.imageUrl} alt={ex.name} className="w-8 h-8 rounded-lg object-cover" />
 ) : (
 <div className="w-8 h-8 rounded-lg bg-secondary dark:bg-card/5 flex items-center justify-center">
 <span className="text-[10px] font-bold text-muted">{ex.name.charAt(0)}</span>
 </div>
 )}
 <span className="font-bold text-foreground ">{ex.name}</span>
 </div>
 </td>
 <td className="px-4 py-3 text-muted">{ex.muscleGroup}</td>
 <td className="px-4 py-3 text-muted">{ex.equipment}</td>
 <td className="px-4 py-3">
 <div className="flex flex-wrap gap-1">
 {ex.difficulty.map((diff) => (
 <span key={diff} className={`px-2 py-0.5 rounded-full text-[9px] font-black ${diffColors[diff] || 'bg-background0/10 text-muted'}`}>
 {diff}
 </span>
 ))}
 </div>
 </td>
 <td className="px-4 py-3 text-muted">{ex.caloriesPerMinute}</td>
 <td className="px-4 py-3 text-muted">{ex.usageCount}</td>
 <td className="px-4 py-3">
 <div className="flex gap-1.5">
 <button onClick={() => { setEditing(ex); setShowModal(true); }} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
 <button onClick={() => del(ex._id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Add/Edit Modal */}
 {showModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
 <div className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl border border-border/20 dark:border-border overflow-hidden max-h-[90vh] flex flex-col">
 <div className="flex items-center justify-between p-6 border-b border-border/10 dark:border-border">
 <h3 className="font-black text-foreground">{editing._id ? 'Edit Exercise' : 'Add Exercise'}</h3>
 <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-muted" /></button>
 </div>
 <div className="overflow-y-auto p-6 space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div className="col-span-2">
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Exercise Name *</label>
 <input value={editing.name} onChange={(e) => setEditing((p: any) => ({ ...p, name: e.target.value }))}
 placeholder="e.g. Barbell Bench Press"
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 {[
 { label: 'Muscle Group', key: 'muscleGroup', options: MUSCLES },
 { label: 'Equipment', key: 'equipment', options: EQUIPMENT },
 { label: 'Category', key: 'category', options: CATEGORIES },
 ].map(({ label, key, options }) => (
 <div key={key}>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">{label}</label>
 <select value={editing[key]} onChange={(e) => setEditing((p: any) => ({ ...p, [key]: e.target.value }))}
 className="w-full px-3 py-2.5 bg-secondary/50 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none">
 {options.map(o => <option key={o}>{o}</option>)}
 </select>
 </div>
 ))}
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Difficulty</label>
 <div className="flex flex-wrap gap-2">
 {DIFFICULTIES.map(d => (
 <label key={d} className="flex items-center gap-2 text-sm text-muted cursor-pointer">
 <input
 type="checkbox"
 checked={editing.difficulty?.includes(d)}
 onChange={(e) => {
 setEditing((p: any) => ({
 ...p,
 difficulty: e.target.checked
 ? [...(p.difficulty || []), d]
 : (p.difficulty || []).filter((diff: string) => diff !== d)
 }));
 }}
 className="w-4 h-4 rounded accent-emerald-500"
 />
 {d}
 </label>
 ))}
 </div>
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Target Sets (Min - Max)</label>
 <div className="flex gap-2">
 <input type="number" min="1" value={editing.recommendedSets?.min || ''}
 onChange={(e) => setEditing((p: any) => ({ ...p, recommendedSets: { ...p.recommendedSets, min: e.target.value ? parseInt(e.target.value) : '' } }))}
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 <input type="number" min="1" value={editing.recommendedSets?.max || ''}
 onChange={(e) => setEditing((p: any) => ({ ...p, recommendedSets: { ...p.recommendedSets, max: e.target.value ? parseInt(e.target.value) : '' } }))}
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Target Reps (Min - Max)</label>
 <div className="flex gap-2">
 <input type="number" min="1" value={editing.recommendedReps?.min || ''}
 onChange={(e) => setEditing((p: any) => ({ ...p, recommendedReps: { ...p.recommendedReps, min: e.target.value ? parseInt(e.target.value) : '' } }))}
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 <input type="number" min="1" value={editing.recommendedReps?.max || ''}
 onChange={(e) => setEditing((p: any) => ({ ...p, recommendedReps: { ...p.recommendedReps, max: e.target.value ? parseInt(e.target.value) : '' } }))}
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Rest Period (Seconds)</label>
 <input type="number" min="0" step="15" value={editing.recommendedRestSeconds || ''}
 onChange={(e) => setEditing((p: any) => ({ ...p, recommendedRestSeconds: e.target.value ? parseInt(e.target.value) : '' }))}
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Calories/Minute</label>
 <input type="number" min="1" value={editing.caloriesPerMinute || ''}
 onChange={(e) => setEditing((p: any) => ({ ...p, caloriesPerMinute: e.target.value ? parseInt(e.target.value) : '' }))}
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 <div className="col-span-2">
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Exercise Image</label>
 <div className="flex items-center gap-4 p-3 bg-background dark:bg-card/5 border border-border/20 dark:border-border rounded-xl">
 {editing.imageUrl ? (
 <div className="relative group">
 <img src={editing.imageUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover bg-card" />
 <button 
 onClick={() => setEditing((p: any) => ({ ...p, imageUrl: '' }))}
 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
 >
 <X className="w-3 h-3" />
 </button>
 </div>
 ) : (
 <div className="w-16 h-16 rounded-lg bg-secondary dark:bg-card/10 flex items-center justify-center">
 <span className="text-[10px] text-muted">No Image</span>
 </div>
 )}
 <div className="flex-1">
 <ImageUploader 
 onUploadSuccess={(url) => setEditing((p: any) => ({ ...p, imageUrl: url }))}
 onUploadError={(err) => alert('Upload failed: ' + err)}
 >
 <button type="button" className="w-full text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl transition-all">
 Select Image
 </button>
 </ImageUploader>
 <p className="text-[10px] text-muted mt-2">Recommended: .webp or transparent .webp</p>
 </div>
 </div>
 </div>
 <div className="col-span-2">
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Instructions (One step per line)</label>
 <textarea rows={5} value={Array.isArray(editing.instructions) ? editing.instructions.join('\n') : editing.instructions}
 onChange={(e) => setEditing((p: any) => ({ ...p, instructions: e.target.value.split('\n') }))}
 placeholder="Step 1...\nStep 2..."
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none" />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Home Version</label>
 <input value={editing.homeVersion}
 onChange={(e) => setEditing((p: any) => ({ ...p, homeVersion: e.target.value }))}
 placeholder="e.g. Push-up"
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Gym Version</label>
 <input value={editing.gymVersion}
 onChange={(e) => setEditing((p: any) => ({ ...p, gymVersion: e.target.value }))}
 placeholder="e.g. Cable Fly"
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 </div>
 </div>
 <div className="p-6 border-t border-border/10 dark:border-border flex justify-end gap-3">
 <button onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-secondary dark:bg-card/5 text-muted">Cancel</button>
 <button onClick={save} disabled={saving || !editing.name}
 className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white disabled:opacity-50">
 {saving ? 'Saving...' : editing._id ? 'Update' : 'Add Exercise'}
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
