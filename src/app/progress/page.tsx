'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Scale, Target, Activity, Calendar, Trophy, ChevronRight, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('@/components/shared/AnalyticsChart'), { ssr: false });
export default function ProgressTracker() {
 // Before / After Slider state
 const [sliderPosition, setSliderPosition] = useState(50); // percentage
 const containerRef = useRef<HTMLDivElement>(null);
 const isDragging = useRef(false);

 // Measurement logs state
 const [waist, setWaist] = useState(82);
 const [chest, setChest] = useState(102);
 const [biceps, setBiceps] = useState(38);
 const [hips, setHips] = useState(90);

 const [weightLogs, setWeightLogs] = useState([
 { date: 'May 01', weight: 75.2 },
 { date: 'May 07', weight: 74.6 },
 { date: 'May 14', weight: 74.0 },
 { date: 'May 21', weight: 73.4 },
 { date: 'May 28', weight: 72.8 },
 ]);

 // 1RM Analytics State
 const [liftData, setLiftData] = useState([
 { date: 'May 01', bench: 60, squat: 80, deadlift: 100 },
 { date: 'May 07', bench: 62.5, squat: 85, deadlift: 105 },
 { date: 'May 14', bench: 65, squat: 87.5, deadlift: 110 },
 { date: 'May 21', bench: 67.5, squat: 92.5, deadlift: 115 },
 { date: 'May 28', bench: 70, squat: 95, deadlift: 120 },
 ]);

 const [newWeight, setNewWeight] = useState('');

 const handleWeightSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (newWeight) {
 const val = parseFloat(newWeight);
 if (!isNaN(val)) {
 const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
 setWeightLogs((prev) => [...prev, { date: today, weight: val }]);
 setNewWeight('');
 alert('Weight logged successfully!');
 }
 }
 };

 const handleSliderMove = (clientX: number) => {
 if (!containerRef.current) return;
 const rect = containerRef.current.getBoundingClientRect();
 const x = clientX - rect.left;
 const percentage = Math.max(0, Math.min((x / rect.width) * 100, 100));
 setSliderPosition(percentage);
 };

 const handleMouseDown = () => {
 isDragging.current = true;
 };

 const handleMouseUp = () => {
 isDragging.current = false;
 };

 const handleMouseMove = (e: React.MouseEvent) => {
 if (!isDragging.current) return;
 handleSliderMove(e.clientX);
 };

 const handleTouchMove = (e: React.TouchEvent) => {
 handleSliderMove(e.touches[0].clientX);
 };

 // Mini Chart math
 const chartHeight = 120;
 const chartWidth = 400;
 const padding = 20;
 const points = weightLogs.map((w, index) => {
 const x = padding + (index * (chartWidth - padding * 2)) / (weightLogs.length - 1);
 const maxWeight = 76;
 const minWeight = 71;
 const y = chartHeight - padding - ((w.weight - minWeight) * (chartHeight - padding * 2)) / (maxWeight - minWeight);
 return { x, y, val: w.weight, label: w.date };
 });

 const pathD = points.reduce((acc, curr, index) => {
 return index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
 }, '');

 return (
 <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
 {/* Return link */}
 <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted hover:text-emerald-500 transition-colors mb-2 no-print">
 <ArrowLeft className="w-3.5 h-3.5" />
 <span>Back to LeanVerse Home</span>
 </Link>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 {/* Left Side: Drag Image Slider & measurements */}
 <div className="lg:col-span-7 space-y-6">
 {/* Slider card */}
 <div className="glass rounded-3xl p-6 border border-border/10 space-y-4">
 <span className="text-xs font-black text-muted uppercase tracking-widest block">Before & After Slider</span>
 
 <div 
 ref={containerRef}
 onMouseMove={handleMouseMove}
 onMouseDown={handleMouseDown}
 onMouseUp={handleMouseUp}
 onMouseLeave={handleMouseUp}
 onTouchMove={handleTouchMove}
 onTouchStart={handleMouseDown}
 onTouchEnd={handleMouseUp}
 className="relative w-full h-[320px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-350/15"
 >
 {/* After image - fallback colors as solid fitness aesthetic backgrounds with labels */}
 <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-emerald-700 flex flex-col items-center justify-center p-4">
 <span className="text-white font-black text-4xl tracking-wider">AFTER</span>
 <span className="text-emerald-350 text-xs font-extrabold mt-1">Lean Bulk & Hypertrophy Split</span>
 </div>

 {/* Before image - masked by slider position */}
 <div 
 className="absolute inset-y-0 left-0 bg-gradient-to-br from-slate-600 to-zinc-700 flex flex-col items-center justify-center p-4 overflow-hidden"
 style={{ width: `${sliderPosition}%` }}
 >
 {/* Fixed width content to avoid squishing */}
 <div className="w-[320px] flex flex-col items-center justify-center">
 <span className="text-white font-black text-4xl tracking-wider">BEFORE</span>
 <span className="text-slate-300 text-xs font-extrabold mt-1">Sedentary baseline</span>
 </div>
 </div>

 {/* Handle Bar */}
 <div 
 className="absolute inset-y-0 w-1 bg-card cursor-ew-resize z-20"
 style={{ left: `${sliderPosition}%` }}
 >
 <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-foreground border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg">
 ↔
 </div>
 </div>
 </div>
 <p className="text-[10px] text-muted text-center font-bold">Drag the center handle to compare visual muscle tone conditioning changes.</p>
 </div>

 {/* Measurements grid */}
 <div className="glass rounded-3xl p-6 border border-border/10 space-y-4">
 <span className="text-xs font-black text-muted uppercase tracking-widest block">Tape Circumference Measurements (cm)</span>
 
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 <div className="p-3 bg-secondary/50 dark:bg-card/5 border border-border/5 rounded-2xl">
 <span className="text-[10px] text-muted font-extrabold block">Chest</span>
 <input 
 type="text" inputMode="numeric" pattern="[0-9]*" min="0" 
 value={chest} 
 onChange={(e) => setChest(parseInt(e.target.value) || 0)}
 className="bg-transparent border-0 font-black text-lg text-foreground focus:ring-0 focus:outline-none w-full mt-1"
 />
 </div>

 <div className="p-3 bg-secondary/50 dark:bg-card/5 border border-border/5 rounded-2xl">
 <span className="text-[10px] text-muted font-extrabold block">Waist</span>
 <input 
 type="text" inputMode="numeric" pattern="[0-9]*" min="0" 
 value={waist} 
 onChange={(e) => setWaist(parseInt(e.target.value) || 0)}
 className="bg-transparent border-0 font-black text-lg text-foreground focus:ring-0 focus:outline-none w-full mt-1"
 />
 </div>

 <div className="p-3 bg-secondary/50 dark:bg-card/5 border border-border/5 rounded-2xl">
 <span className="text-[10px] text-muted font-extrabold block">Biceps</span>
 <input 
 type="text" inputMode="numeric" pattern="[0-9]*" min="0" 
 value={biceps} 
 onChange={(e) => setBiceps(parseInt(e.target.value) || 0)}
 className="bg-transparent border-0 font-black text-lg text-foreground focus:ring-0 focus:outline-none w-full mt-1"
 />
 </div>

 <div className="p-3 bg-secondary/50 dark:bg-card/5 border border-border/5 rounded-2xl">
 <span className="text-[10px] text-muted font-extrabold block">Hips</span>
 <input 
 type="text" inputMode="numeric" pattern="[0-9]*" min="0" 
 value={hips} 
 onChange={(e) => setHips(parseInt(e.target.value) || 0)}
 className="bg-transparent border-0 font-black text-lg text-foreground focus:ring-0 focus:outline-none w-full mt-1"
 />
 </div>
 </div>
 </div>
 </div>

 {/* Right Side: Weight Log Table & Line chart */}
 <div className="lg:col-span-5 space-y-6">
 {/* Line Chart */}
 <div className="glass rounded-3xl p-6 border border-border/10 space-y-4">
 <span className="text-xs font-black text-muted uppercase tracking-widest block">Weight progress (kg)</span>
 
 <div className="w-full h-32 flex items-end">
 <svg className="w-full h-full">
 {/* Paths */}
 <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
 {/* points */}
 {points.map((p, i) => (
 <g key={i}>
 <circle cx={p.x} cy={p.y} r="4" fill="#06b6d4" />
 <text x={p.x} y={p.y - 8} className="text-[9px] font-black fill-slate-500 text-center" textAnchor="middle">{p.val}</text>
 <text x={p.x} y={chartHeight - 4} className="text-[8px] font-bold fill-slate-400" textAnchor="middle">{p.label}</text>
 </g>
 ))}
 </svg>
 </div>

 {/* Quick logger */}
 <form onSubmit={handleWeightSubmit} className="flex space-x-2 pt-4 border-t border-border/10">
 <input
 type="text"
 inputMode="numeric" pattern="[0-9]*"
 placeholder="Log Weight kg"
 value={newWeight}
 onChange={(e) => setNewWeight(e.target.value)}
 className="flex-1 bg-secondary/50 dark:bg-card/5 border border-slate-350/20 dark:border-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-bold text-foreground"
 />
 <button
 type="submit"
 className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-4 py-2.5 font-bold text-xs flex items-center shrink-0 cursor-pointer"
 >
 <Plus className="w-4 h-4 mr-1" />
 <span>Log weight</span>
 </button>
 </form>
 </div>

 {/* Detailed logs table list */}
 <div className="glass rounded-3xl p-6 border border-border/10 space-y-4">
 <span className="text-xs font-black text-muted uppercase tracking-widest block">Recorded Weight logs</span>
 <div className="space-y-2.5 overflow-y-auto max-h-[180px] pr-1 no-scrollbar">
 {weightLogs.slice().reverse().map((log, index) => (
 <div key={index} className="flex justify-between items-center py-2.5 border-b border-border/10 last:border-0 text-sm font-semibold">
 <div className="flex items-center space-x-2 text-muted">
 <Calendar className="w-4 h-4" />
 <span>{log.date}</span>
 </div>
 <span className="text-slate-850 dark:text-foreground font-black">{log.weight} kg</span>
 </div>
 ))}
 </div>
 </div>

 {/* 1RM Analytics Chart */}
 <div className="glass rounded-3xl p-6 border border-border/10 space-y-4">
 <div className="flex justify-between items-center">
 <span className="text-xs font-black text-muted uppercase tracking-widest block">Estimated 1RM Analytics (kg)</span>
 <TrendingUp className="w-4 h-4 text-emerald-500" />
 </div>
 
 <div className="w-full h-48 mt-4 -ml-4">
 <AnalyticsChart liftData={liftData} />
 </div>
 <p className="text-[10px] text-muted text-center font-bold">Estimated 1RM uses the Epley formula based on your logged working sets.</p>
 </div>
 </div>
 </div>
 </div>
 );
}
