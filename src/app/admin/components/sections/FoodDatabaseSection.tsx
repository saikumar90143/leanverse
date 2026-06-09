'use client';

import React, { useState, useEffect } from 'react';
import { Apple, TrendingUp, Target, BarChart3, Plus, X, Edit, Search } from 'lucide-react';

const DIET_STYLES_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'South Indian', 'North Indian', 'High Protein', 'Keto'];
const MEAL_TYPES_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Pre-Workout', 'Post-Workout', 'Snack'];

export default function FoodDatabaseSection() {
 const [topFoods, setTopFoods] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [searchQuery, setSearchQuery] = useState('');

 // Form State
 const [formData, setFormData] = useState({
 name: '',
 emoji: '',
 dietStyle: [] as string[],
 mealTypes: [] as string[],
 servingUnit: '',
 calories: '' as number | '',
 protein: '' as number | '',
 carbs: '' as number | '',
 fat: '' as number | ''
 });

 const fetchFoods = () => {
 setLoading(true);
 fetch('/api/admin/foods')
 .then(r => r.json())
 .then(data => {
 if (data.foods) setTopFoods(data.foods);
 setLoading(false);
 })
 .catch(() => setLoading(false));
 };

 useEffect(() => {
 fetchFoods();
 }, []);

 const handleSaveFood = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSubmitting(true);
 try {
 const payload: any = {
 ...formData,
 calories: formData.calories === '' ? 0 : formData.calories,
 protein: formData.protein === '' ? 0 : formData.protein,
 carbs: formData.carbs === '' ? 0 : formData.carbs,
 fat: formData.fat === '' ? 0 : formData.fat,
 };
 
 if (editingId) {
 payload._id = editingId;
 }
 
 const res = await fetch('/api/admin/foods', {
 method: editingId ? 'PUT' : 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(payload)
 });
 
 if (res.ok) {
 setShowModal(false);
 setEditingId(null);
 setFormData({
 name: '', emoji: '', dietStyle: [], mealTypes: [], servingUnit: '',
 calories: '' as number | '', protein: '' as number | '', carbs: '' as number | '', fat: '' as number | ''
 });
 fetchFoods();
 } else {
 const errorData = await res.json().catch(() => ({}));
 alert(`Failed to save food item: ${errorData.error || 'Unknown error'}`);
 }
 } catch (err) {
 alert('Error saving food item');
 }
 setIsSubmitting(false);
 };

 const handleEdit = (food: any) => {
 setEditingId(food._id);
 setFormData({
 name: food.name,
 emoji: food.emoji || '',
 dietStyle: food.dietStyle || [],
 mealTypes: food.mealTypes || [],
 servingUnit: food.servingUnit || '',
 calories: food.calories,
 protein: food.protein,
 carbs: food.carbs,
 fat: food.fat
 });
 setShowModal(true);
 };

 const toggleArray = (field: 'dietStyle' | 'mealTypes', val: string) => {
 setFormData(prev => ({
 ...prev,
 [field]: prev[field].includes(val) 
 ? prev[field].filter(item => item !== val)
 : [...prev[field], val]
 }));
 };

 if (loading && topFoods.length === 0) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
 </div>
 );
 }

 return (
 <div className="space-y-6 relative">
 <div className="flex justify-between items-center">
 <h2 className="text-xl font-black text-foreground">Diet & Nutrition</h2>
 <button 
 onClick={() => {
 setEditingId(null);
 setFormData({
 name: '', emoji: '', dietStyle: [], mealTypes: [], servingUnit: '',
 calories: '' as number | '', protein: '' as number | '', carbs: '' as number | '', fat: '' as number | ''
 });
 setShowModal(true);
 }}
 className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md"
 >
 <Plus className="w-4 h-4" /> Add Food Item
 </button>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 {[
 { label: 'Food Items', value: topFoods.length, icon: Apple, color: 'text-emerald-500 bg-emerald-500/10' },
 ].map(s => (
 <div key={s.label} className="glass rounded-2xl p-4 border border-border/10 dark:border-border flex items-center gap-3">
 <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-4 h-4" /></div>
 <div>
 <p className="text-[10px] text-muted font-bold">{s.label}</p>
 <p className="text-xl font-black text-foreground">{s.value}</p>
 </div>
 </div>
 ))}
 </div>

 <div className="glass rounded-2xl border border-border/10 dark:border-border overflow-hidden">
 <div className="p-5 border-b border-border/10 dark:border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <h3 className="font-black text-foreground text-sm">Food Database</h3>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
 <input type="text" placeholder="Search foods..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64 pl-9 pr-4 py-2 bg-background dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-xs">
 <thead>
 <tr className="border-b border-border/10 dark:border-border bg-background/50 dark:bg-card/2">
 {['Emoji', 'Name', 'Diet Style', 'Meal Types', 'Serving Unit', 'Cals', 'Protein', 'Carbs', 'Fat', 'Actions'].map(h => (
 <th key={h} className="text-left px-4 py-3 font-black text-muted whitespace-nowrap">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200/5 dark:divide-white/5">
 {topFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((f) => (
 <tr key={f._id || f.name} className="hover:bg-background/30 dark:hover:bg-card/3">
 <td className="px-4 py-3 text-lg">{f.emoji}</td>
 <td className="px-4 py-3 font-bold text-foreground ">{f.name}</td>
 <td className="px-4 py-3 text-muted">{f.dietStyle?.join(', ') || '-'}</td>
 <td className="px-4 py-3 text-muted">{f.mealTypes?.join(', ') || '-'}</td>
 <td className="px-4 py-3 text-muted font-medium">{f.servingUnit}</td>
 <td className="px-4 py-3 text-muted font-bold">{f.calories}</td>
 <td className="px-4 py-3 text-emerald-500 font-bold">{f.protein}g</td>
 <td className="px-4 py-3 text-amber-500 font-bold">{f.carbs}g</td>
 <td className="px-4 py-3 text-rose-500 font-bold">{f.fat}g</td>
 <td className="px-4 py-3">
 <button onClick={() => handleEdit(f)} className="text-muted hover:text-emerald-500 transition-colors p-1 rounded-md hover:bg-emerald-500/10">
 <Edit className="w-4 h-4" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Add Food Item Modal */}
 {showModal && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
 <div className="glass w-full max-w-2xl bg-card rounded-3xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-xl font-black text-foreground flex items-center gap-2">
 <Apple className="text-emerald-500 w-5 h-5" /> {editingId ? 'Edit Food Item' : 'Add New Food Item'}
 </h3>
 <button onClick={() => setShowModal(false)} className="text-muted hover:text-white p-1 rounded-full hover:bg-card/10 transition-colors">
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleSaveFood} className="space-y-6">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-muted mb-1">Name</label>
 <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="e.g. Chicken Breast" />
 </div>
 <div>
 <label className="block text-xs font-bold text-muted mb-1">Emoji</label>
 <input type="text" required value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="e.g. 🍗" />
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-muted mb-2">Diet Style(s)</label>
 <div className="flex flex-wrap gap-2">
 {DIET_STYLES_OPTIONS.map(style => (
 <button type="button" key={style} onClick={() => toggleArray('dietStyle', style)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${formData.dietStyle.includes(style) ? 'bg-emerald-500 text-white' : 'bg-secondary dark:bg-card/5 text-muted hover:bg-secondary dark:hover:bg-card/10'}`}>
 {style}
 </button>
 ))}
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-muted mb-2">Meal Type(s)</label>
 <div className="flex flex-wrap gap-2">
 {MEAL_TYPES_OPTIONS.map(type => (
 <button type="button" key={type} onClick={() => toggleArray('mealTypes', type)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${formData.mealTypes.includes(type) ? 'bg-emerald-500 text-white' : 'bg-secondary dark:bg-card/5 text-muted hover:bg-secondary dark:hover:bg-card/10'}`}>
 {type}
 </button>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-muted mb-1">Serving Unit</label>
 <input type="text" required value={formData.servingUnit} onChange={e => setFormData({...formData, servingUnit: e.target.value})} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="e.g. 100g, 1 Cup, 1 Egg" />
 </div>
 <div>
 <label className="block text-xs font-bold text-muted mb-1">Calories</label>
 <input type="number" required min="0" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value === '' ? '' : parseFloat(e.target.value)})} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-4">
 <div>
 <label className="block text-xs font-bold text-emerald-500 mb-1">Protein (g)</label>
 <input type="number" required min="0" step="0.1" value={formData.protein} onChange={e => setFormData({...formData, protein: e.target.value === '' ? '' : parseFloat(e.target.value)})} className="w-full bg-background border border-emerald-500/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 <div>
 <label className="block text-xs font-bold text-amber-500 mb-1">Carbs (g)</label>
 <input type="number" required min="0" step="0.1" value={formData.carbs} onChange={e => setFormData({...formData, carbs: e.target.value === '' ? '' : parseFloat(e.target.value)})} className="w-full bg-background border border-amber-500/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
 </div>
 <div>
 <label className="block text-xs font-bold text-rose-500 mb-1">Fat (g)</label>
 <input type="number" required min="0" step="0.1" value={formData.fat} onChange={e => setFormData({...formData, fat: e.target.value === '' ? '' : parseFloat(e.target.value)})} className="w-full bg-background border border-rose-500/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500" />
 </div>
 </div>

 <button type="submit" disabled={isSubmitting || formData.dietStyle.length === 0 || formData.mealTypes.length === 0} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center">
 {isSubmitting ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : editingId ? 'Save Changes' : 'Add to Database'}
 </button>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
