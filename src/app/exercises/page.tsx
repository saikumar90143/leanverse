'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, Dumbbell, Flame, X, ChevronRight, PlayCircle, Plus, Trash2, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/layout/AuthProvider';

export default function ExerciseLibraryPage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchExercises = () => {
    const url = user?.id ? `/api/exercises?userId=${user.id}` : '/api/exercises';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.exercises) setExercises(data.exercises);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchExercises();
  }, [user?.id]);

  const getExerciseImage = (ex: any): string => {
    if (ex.imageUrl && ex.imageUrl.trim() !== '') return ex.imageUrl;
    if (ex.isCustom) return '/images/chest_press.webp'; // default for custom
    const pattern = (ex.primaryMovementPattern || '').toLowerCase();
    const muscle = (ex.muscleGroup || '').toLowerCase();
    if (pattern === 'push') {
      if (muscle.includes('chest')) return '/images/chest_press.webp';
      if (muscle.includes('shoulder') || muscle.includes('tricep')) return '/images/shoulders_press.webp';
      return '/images/chest_press.webp';
    }
    if (pattern === 'pull') {
      if (muscle.includes('bicep')) return '/images/biceps.webp';
      return '/images/back_pullup.webp';
    }
    if (pattern === 'hinge') return '/images/back.webp';
    if (pattern === 'squat') return '/images/legs_squat.webp';
    if (pattern === 'lunge') return '/images/legs_lunge.webp';
    if (pattern === 'core') return '/images/abs_crunch.webp';
    if (pattern === 'cardio') return '/images/cardio_run.webp';
    if (muscle.includes('chest')) return '/images/chest_press.webp';
    if (muscle.includes('back')) return '/images/back_pullup.webp';
    if (muscle.includes('shoulder')) return '/images/shoulders_press.webp';
    if (muscle.includes('bicep')) return '/images/biceps.webp';
    if (muscle.includes('tricep')) return '/images/triceps.webp';
    if (muscle.includes('leg')) return '/images/legs_squat.webp';
    if (muscle.includes('abs') || muscle.includes('core')) return '/images/abs_crunch.webp';
    if (muscle.includes('cardio')) return '/images/cardio_run.webp';
    return '/images/chest_press.webp';
  };

  const getCustomImage = (muscle: string): string => {
    const m = muscle.toLowerCase();
    if (m.includes('chest')) return '/images/chest_press.webp';
    if (m.includes('back')) return '/images/back_pullup.webp';
    if (m.includes('shoulder')) return '/images/shoulders_press.webp';
    if (m.includes('bicep')) return '/images/biceps.webp';
    if (m.includes('tricep')) return '/images/triceps.webp';
    if (m.includes('leg')) return '/images/legs_squat.webp';
    if (m.includes('abs')) return '/images/abs_crunch.webp';
    if (m.includes('cardio')) return '/images/cardio_run.webp';
    return '/images/chest_press.webp';
  };

  const muscles = ['All', ...Array.from(new Set(exercises.map(e => e.muscleGroup)))].sort();
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
      const matchesDifficulty = selectedDifficulty === 'All' || (ex.difficulty && ex.difficulty.includes(selectedDifficulty));
      return matchesSearch && matchesMuscle && matchesDifficulty;
    });
  }, [exercises, searchQuery, selectedMuscle, selectedDifficulty]);

  const handleDeleteExercise = async (ex: any) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/exercises?id=${ex._id}&userId=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        setExercises(prev => prev.filter(e => e._id !== ex._id));
        setSelectedExercise(null);
        setDeleteConfirm(null);
      }
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-bold text-xs">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>The LeanVerse Vault</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Exercise Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Master your biomechanics. Browse our comprehensive database or create your own custom exercises.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="glass p-4 sm:p-6 rounded-3xl border border-slate-200/50 dark:border-white/10 space-y-6 shadow-sm">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercises (e.g. Bench Press, Squats)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
              <Filter className="w-3 h-3" />
              <span>Target Muscle</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {muscles.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedMuscle === muscle
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/50'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-64 space-y-3 shrink-0">
            <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
              <Flame className="w-3 h-3" />
              <span>Difficulty</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedDifficulty === level
                      ? 'bg-slate-800 dark:bg-slate-100 border-slate-800 dark:border-slate-100 text-white dark:text-slate-900 shadow-md'
                      : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-800/50 dark:hover:border-slate-100/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden animate-pulse">
              <div className="aspect-video bg-slate-200 dark:bg-zinc-800" />
              <div className="p-5 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-lg w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 border-dashed dark:border-white/10">
          <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">No exercises found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExercises.map((ex) => (
            <div
              key={ex._id}
              onClick={() => setSelectedExercise(ex)}
              className="group bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col relative"
              style={{ borderColor: ex.isCustom ? 'rgba(139,92,246,0.3)' : undefined }}
            >
              {/* Custom badge */}
              {ex.isCustom && (
                <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 px-2 py-1 rounded-lg bg-violet-500/90 backdrop-blur-md text-white text-[10px] font-black shadow">
                  <Lock className="w-2.5 h-2.5" />
                  <span>My Exercise</span>
                </div>
              )}
              <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                <Image
                  src={ex.isCustom ? getCustomImage(ex.muscleGroup) : getExerciseImage(ex)}
                  alt={ex.name}
                  fill
                  className="object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap max-w-[60%]">
                  <span className="px-2 py-1 rounded-md bg-white/90 dark:bg-zinc-900/90 text-[10px] font-black text-slate-800 dark:text-slate-100 shadow-sm backdrop-blur-md">
                    {ex.muscleGroup}
                  </span>
                  {ex.difficulty?.slice(0, 1).map((d: string) => (
                    <span key={d} className={`px-2 py-1 rounded-md text-[10px] font-black shadow-sm backdrop-blur-md ${
                      d === 'Beginner' ? 'bg-emerald-500/90 text-white' :
                      d === 'Intermediate' ? 'bg-amber-500/90 text-white' :
                      'bg-red-500/90 text-white'
                    }`}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 line-clamp-1">{ex.name}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center"><Dumbbell className="w-3 h-3 mr-1"/> {ex.equipment || 'Bodyweight'}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${ex.isCustom ? 'text-violet-500' : 'text-emerald-500'}`}>
                    {ex.isCustom ? 'Custom' : ex.category || 'Strength'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => { setSelectedExercise(null); setDeleteConfirm(null); }}
          />
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            {/* Modal Header/Image */}
            <div className="relative h-48 sm:h-64 bg-slate-100 dark:bg-zinc-800 w-full shrink-0 border-b border-slate-200/50 dark:border-white/10">
              <Image
                src={selectedExercise.isCustom ? getCustomImage(selectedExercise.muscleGroup) : getExerciseImage(selectedExercise)}
                alt={selectedExercise.name}
                fill
                className="object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {selectedExercise.isCustom && (
                <div className="absolute top-4 left-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-violet-500/90 backdrop-blur-md text-white text-xs font-black shadow">
                  <UserIcon className="w-3 h-3" />
                  <span>My Custom Exercise</span>
                </div>
              )}

              <button
                onClick={() => { setSelectedExercise(null); setDeleteConfirm(null); }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
              >
                <X className="w-4 h-4 text-slate-800 dark:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                    {selectedExercise.muscleGroup}
                  </span>
                  {selectedExercise.difficulty?.map((d: string) => (
                    <span key={d} className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                      d === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      d === 'Intermediate' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {d}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-wider">
                    {selectedExercise.equipment || 'Bodyweight'}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{selectedExercise.name}</h2>
                {selectedExercise.description && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{selectedExercise.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Target Sets</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {selectedExercise.recommendedSets ? `${selectedExercise.recommendedSets.min}-${selectedExercise.recommendedSets.max}` : '3-4'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Target Reps</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {selectedExercise.recommendedReps ? `${selectedExercise.recommendedReps.min}-${selectedExercise.recommendedReps.max}` : '8-12'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Rest Period</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {selectedExercise.recommendedRestSeconds ? `${selectedExercise.recommendedRestSeconds}s` : '60s'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Burn Rate</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedExercise.caloriesPerMinute || 5} kcal/m</span>
                </div>
              </div>

              {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center border-b border-slate-200/50 dark:border-white/10 pb-2">
                    <PlayCircle className="w-4 h-4 mr-1.5 text-emerald-500" /> Form & Execution
                  </h3>
                  <ul className="space-y-3">
                    {selectedExercise.instructions.filter((s: string) => s.trim().length > 0).map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Delete button — only for user's own custom exercises */}
              {selectedExercise.isCustom && user?.id === selectedExercise.createdBy && (
                <div className="pt-2 border-t border-slate-200/50 dark:border-white/10">
                  {deleteConfirm === selectedExercise._id ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 flex-1">Are you sure?</span>
                      <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-slate-200 transition-all cursor-pointer">Cancel</button>
                      <button onClick={() => handleDeleteExercise(selectedExercise)} className="px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all cursor-pointer flex items-center space-x-1">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(selectedExercise._id)}
                      className="w-full py-3 text-sm font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete this exercise</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
