'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, TrendingUp, Calendar, ArrowUpRight, Search, Activity, Dumbbell } from 'lucide-react';
import { getUserStorageKey } from '@/lib/storage';
import { transformationExercises } from '@/lib/transformationExercises';
import { getUserStats } from '@/lib/userStats';
import { useAuth } from '@/components/layout/AuthProvider';
import Link from 'next/link';

interface PRData {
 exerciseId: string;
 name: string;
 muscleGroup: string;
 imageUrl?: string;
 maxWeight: number;
 maxReps: number;
 maxRepsAtMaxWeight: number;
 estimated1RM: number;
 lastPerformed: string;
}

export default function PersonalRecordsPage() {
 const { user } = useAuth();
 const [prList, setPrList] = useState<PRData[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [filterMuscle, setFilterMuscle] = useState('All');
 const [isMounted, setIsMounted] = useState(false);
 const [loading, setLoading] = useState(true);
 const [dbExercises, setDbExercises] = useState<any[]>([]);

 useEffect(() => {
   let url = '/api/exercises';
   if (user?.id) url += `?userId=${user.id}`;
   
   fetch(url)
     .then(res => res.json())
     .then(data => {
       if (data && Array.isArray(data.exercises)) setDbExercises(data.exercises);
     })
     .catch(console.error);
 }, [user?.id]);

  useEffect(() => {
    setIsMounted(true);
    
    // We only load data once mounted to avoid hydration mismatch
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPRs = async () => {
      try {
        const res = await fetch('/api/personal-records');
        const data = await res.json();
        
        let prsObj = data.prs;
        
        // Fallback to local cache if DB is empty (Migration Step)
        if (!prsObj || Object.keys(prsObj).length === 0) {
          const stats = getUserStats();
          if (stats.prs && Object.keys(stats.prs).length > 0) {
            prsObj = stats.prs;
            // Sync locally stored PRs up to the new DB since it's empty on the server
            fetch('/api/personal-records', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prs: prsObj }),
            }).catch(console.error);
          }
        }

        const calculatedPRs: PRData[] = [];
        const allExercises = [...transformationExercises, ...dbExercises];

        Object.entries(prsObj || {}).forEach(([exerciseId, prStats]: [string, any]) => {
          const meta = allExercises.find(e => e.id === exerciseId || (e as any)._id === exerciseId);
          if (meta) {
            calculatedPRs.push({
              exerciseId,
              name: meta.name,
              muscleGroup: meta.muscleGroup,
              imageUrl: (meta as any).imageUrl,
              maxWeight: prStats.maxWeight,
              maxReps: prStats.maxReps,
              maxRepsAtMaxWeight: prStats.maxRepsAtMaxWeight,
              estimated1RM: prStats.estimated1RM,
              lastPerformed: prStats.lastPerformed
            });
          }
        });

        // Sort by recently performed
        calculatedPRs.sort((a, b) => new Date(b.lastPerformed).getTime() - new Date(a.lastPerformed).getTime());
        setPrList(calculatedPRs);
      } catch (e) {
        console.error('Failed to load PRs', e);
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
  }, [user, dbExercises]);

 const filteredPRs = useMemo(() => {
 return prList.filter(pr => {
 const matchesSearch = pr.name.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesFilter = filterMuscle === 'All' || pr.muscleGroup === filterMuscle;
 return matchesSearch && matchesFilter;
 });
 }, [prList, searchQuery, filterMuscle]);

 const allMuscles = ['All', ...Array.from(new Set(prList.map(p => p.muscleGroup))).sort()];

 if (!isMounted) return null;

 if (!user) {
   return (
     <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 bg-background">
       <div className="glass rounded-3xl p-12 border border-border/20 shadow-xl max-w-md w-full">
         <Trophy className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
         <h2 className="text-2xl font-black text-foreground mb-2">Please login first</h2>
         <p className="text-muted mb-6">You need to be logged in to view your personal records and strength progression.</p>
         <Link href="/login?redirect=/personal-records" className="inline-flex bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all scale-100 hover:scale-105 active:scale-95">
           Go to Login
         </Link>
       </div>
     </div>
   );
 }

 return (
 <div className="min-h-screen pt-24 pb-20 bg-background transition-colors">
 <div className="max-w-6xl mx-auto px-4 sm:px-6">
 
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
 <div>
 <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
 <Trophy className="w-8 h-8 text-amber-500" />
 Personal Records
 </h1>
 <p className="text-muted mt-2 font-medium">
 Track your strength progression and lifetime milestones.
 </p>
 </div>
 
 <div className="flex items-center gap-3">
 <div className="bg-card border border-border/50 dark:border-border px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
 <Activity className="w-4 h-4 text-emerald-500" />
 <span className="text-sm font-bold text-foreground dark:text-muted">{prList.length} Exercises Tracked</span>
 </div>
 </div>
 </div>

 {/* Loading State */}
 {loading ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {[1, 2, 3, 4, 5, 6].map(i => (
 <div key={i} className="glass rounded-3xl p-5 border border-border/20 dark:border-border shadow-xl h-48 animate-pulse flex flex-col justify-between">
 <div className="flex items-start gap-3">
 <div className="w-12 h-12 bg-secondary/50 dark:bg-card rounded-xl"></div>
 <div className="space-y-2 flex-1 pt-1">
 <div className="h-4 bg-secondary/50 dark:bg-card rounded w-3/4"></div>
 <div className="h-3 bg-secondary/50 dark:bg-card rounded w-1/4"></div>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-3 mt-4">
 <div className="h-16 bg-secondary/50 dark:bg-card rounded-2xl"></div>
 <div className="h-16 bg-secondary/50 dark:bg-card rounded-2xl"></div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <>
 {/* Filters */}
 <div className="glass rounded-3xl p-4 sm:p-5 mb-8 border border-border/20 dark:border-border shadow-lg flex flex-col sm:flex-row gap-4">
 <div className="relative flex-1">
 <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
 <input 
 type="text" 
 placeholder="Search exercises..." 
 value={searchQuery}
 onChange={e => setSearchQuery(e.target.value)}
 className="w-full bg-secondary/50 dark:bg-card border border-border/50 dark:border-border rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-foreground focus:outline-emerald-500"
 />
 </div>
 
 <div className="sm:w-64 shrink-0 overflow-x-auto hide-scrollbar">
 <div className="flex sm:grid sm:grid-cols-1 gap-2">
 <select 
 value={filterMuscle} 
 onChange={e => setFilterMuscle(e.target.value)}
 className="w-full bg-secondary/50 dark:bg-card border border-border/50 dark:border-border rounded-2xl px-4 py-3.5 text-sm font-bold text-foreground focus:outline-emerald-500 shrink-0"
 >
 {allMuscles.map(m => (
 <option key={m} value={m}>{m}</option>
 ))}
 </select>
 </div>
 </div>
 </div>

 {/* PR Grid */}
 {filteredPRs.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {filteredPRs.map(pr => (
 <div key={pr.exerciseId} className="glass rounded-3xl p-5 border border-border/20 dark:border-border shadow-xl hover:shadow-emerald-500/10 transition-all group overflow-hidden relative">
 
 {/* Background Decoration */}
 <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

 <div className="flex items-start justify-between mb-4 relative z-10">
 <div className="flex items-center gap-3">
 {pr.imageUrl ? (
 <div className="w-12 h-12 rounded-xl overflow-hidden bg-card shrink-0 border border-border/50 dark:border-border">
 <img src={pr.imageUrl} alt={pr.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
 </div>
 ) : (
 <div className="w-12 h-12 rounded-xl bg-secondary dark:bg-card/5 flex items-center justify-center shrink-0 border border-border/50 dark:border-border">
 <Dumbbell className="w-6 h-6 text-muted" />
 </div>
 )}
 <div>
 <h3 className="font-black text-foreground leading-tight">{pr.name}</h3>
 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{pr.muscleGroup}</span>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3 relative z-10">
 {pr.maxWeight > 0 ? (
 <>
 <div className="bg-secondary/50 dark:bg-card rounded-2xl p-3 border border-border/50 dark:border-border">
 <span className="text-[10px] font-bold text-muted uppercase block mb-1">Max Weight</span>
 <div className="flex items-end gap-1">
 <span className="text-2xl font-black text-foreground leading-none">{pr.maxWeight}</span>
 <span className="text-xs font-bold text-muted pb-0.5">kg</span>
 </div>
 </div>
 <div className="bg-secondary/50 dark:bg-card rounded-2xl p-3 border border-border/50 dark:border-border">
 <span className="text-[10px] font-bold text-muted uppercase block mb-1">Reps</span>
 <div className="flex items-end gap-1">
 <span className="text-2xl font-black text-emerald-500 leading-none">{pr.maxRepsAtMaxWeight}</span>
 <span className="text-xs font-bold text-emerald-500/50 pb-0.5">reps</span>
 </div>
 </div>
 </>
 ) : (
 <div className="col-span-2 bg-secondary/50 dark:bg-card rounded-2xl p-3 border border-border/50 dark:border-border">
 <span className="text-[10px] font-bold text-muted uppercase block mb-1">Max Reps (Bodyweight)</span>
 <div className="flex items-end gap-1">
 <span className="text-2xl font-black text-foreground leading-none">{pr.maxReps}</span>
 <span className="text-xs font-bold text-muted pb-0.5">reps</span>
 </div>
 </div>
 )}
 </div>

 <div className="mt-4 flex items-center justify-between text-xs font-bold text-muted relative z-10 pt-4 border-t border-border/50 dark:border-border">
 <div className="flex items-center gap-1.5">
 <Calendar className="w-3.5 h-3.5" />
 <span>Last performed {new Date(pr.lastPerformed).toLocaleDateString()}</span>
 </div>
 </div>

 </div>
 ))}
 </div>
 ) : (
 <div className="glass rounded-3xl p-12 text-center border border-border/20 dark:border-border shadow-xl flex flex-col items-center justify-center min-h-[400px]">
 <Trophy className="w-16 h-16 text-muted mb-4" />
 <h3 className="text-2xl font-black text-foreground mb-2">No Records Yet</h3>
 <p className="text-muted max-w-md mx-auto mb-6">
 Complete workouts in the AI Workout Planner to automatically track your strength milestones and personal records here!
 </p>
 </div>
 )}
 </>
 )}

 </div>
 </div>
 );
}
