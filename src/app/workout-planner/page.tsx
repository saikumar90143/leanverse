'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Sparkles, Play, Pause, RotateCcw, CheckCircle2, ChevronRight, Activity, Clock, Flame, Trophy, Star, Shield, ArrowRight, Target, Plus, Search, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';
import { getUserStorageKey, formatLocalDate } from '@/lib/storage';
import { TransformationState, UserProfile, Goal, WorkoutLocation, ExperienceLevel, WorkoutExercise } from '@/lib/types/transformation';
import { generateTransformationJourney, populateExercisesForDay, logWorkoutCompletion, areExercisesSimilar } from '@/lib/workoutEngine';
import { transformationExercises } from '@/lib/transformationExercises';

export default function AIWorkoutPlanner() {
 const [isMounted, setIsMounted] = useState(false);
 const router = useRouter();
 const { user, loading: authLoading } = useAuth();
 
 // Transformation State
 const [state, setState] = useState<TransformationState | null>(null);
 
 // Wizard States
 const [step, setStep] = useState(1);
 const [location, setLocation] = useState<WorkoutLocation>('gym');
 const [experience, setExperience] = useState<ExperienceLevel>('intermediate');
 const [duration, setDuration] = useState<20|30|45|60|90>(60);
 const [goal, setGoal] = useState<Goal>('muscle');
 const [daysPerWeek, setDaysPerWeek] = useState<3|4|5|6|7>(4);
 const [timelineDays, setTimelineDays] = useState(30);
 const [equipment, setEquipment] = useState<string[]>(['dumbbells']);
 const [loading, setLoading] = useState(false);

 // Active Workout State
 const [logs, setLogs] = useState<Record<string, { reps: string; weight: string }[]>>({});
 const [viewDayIndex, setViewDayIndex] = useState(-1);

 useEffect(() => {
 if (state && viewDayIndex === -1) {
 setViewDayIndex(state.currentDay - 1);
 }
 }, [state, viewDayIndex]);
 
 // Auto-fill logs with history for progressive overload
 useEffect(() => {
 if (state && state.schedule && state.currentDay) {
 const day = state.schedule[state.currentDay - 1];
 if (day && day.mainExercises && !day.completed) {
 setLogs(prev => {
 const newLogs = { ...prev };
 let changed = false;
 
 day.mainExercises.forEach(ex => {
 if (!newLogs[ex.id]) {
 const history = state.exerciseHistory?.[ex.exerciseId];
 if (history && history.length > 0) {
 const lastSession = history[history.length - 1];
 // Pre-fill the inputs with the exact weights and reps they hit last time
 newLogs[ex.id] = Array.from({ length: ex.targetSets }).map((_, i) => ({
 reps: lastSession.repsAchieved[i] !== undefined ? lastSession.repsAchieved[i].toString() : '',
 weight: lastSession.weightUsed[i] !== undefined ? lastSession.weightUsed[i].toString() : ''
 }));
 changed = true;
 }
 }
 });
 
 return changed ? newLogs : prev;
 });
 }
 }
 }, [state?.currentDay, state?.schedule, state?.exerciseHistory]);
 
 // Exercise Search Modal
 const [showExerciseSearch, setShowExerciseSearch] = useState(false);
 const [exerciseSearch, setExerciseSearch] = useState('');
 const searchInputRef = useRef<HTMLInputElement>(null);

 // DB Exercises State
 const [dbExercises, setDbExercises] = useState<any[]>([]);

 useEffect(() => {
 const url = user?.id ? `/api/exercises?userId=${user.id}` : '/api/exercises';
 fetch(url)
 .then(res => res.json())
 .then(data => {
 if (data.exercises) {
 setDbExercises(data.exercises);
 }
 })
 .catch(console.error);
 }, [user?.id]);

 // Custom Exercise State
 const [showCreateExercise, setShowCreateExercise] = useState(false);
 const [editExerciseId, setEditExerciseId] = useState<string | null>(null);
 const [creating, setCreating] = useState(false);
 const [cfName, setCfName] = useState('');
 const [cfMuscle, setCfMuscle] = useState('Chest');
 const [cfEquipment, setCfEquipment] = useState('Bodyweight');
 const [cfCategory, setCfCategory] = useState('Strength');
 const [cfDescription, setCfDescription] = useState('');
 const [pendingAutoGenerate, setPendingAutoGenerate] = useState(false);

 const muscleOptions = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs', 'Cardio'];
 const equipmentOptions = ['Bodyweight', 'Dumbbells', 'Barbell', 'Cables', 'Machine', 'Resistance Band', 'Kettlebell', 'Other'];
 const categoryOptions = ['Strength', 'Cardio', 'HIIT', 'Mobility', 'Stretching'];

 useEffect(() => {
 if (!authLoading && !user) {
 router.push('/login');
 }
 }, [user, authLoading, router]);

 useEffect(() => {
 setIsMounted(true);
 
 // Check if we arrived here from the Quick Start wizard on the home page
 try {
 const pendingStr = localStorage.getItem('leanverse_pending_wizard');
 if (pendingStr) {
 const pending = JSON.parse(pendingStr);
 if (pending.goal) setGoal(pending.goal as Goal);
 if (pending.location) setLocation(pending.location as WorkoutLocation);
 if (pending.experience) setExperience(pending.experience as ExperienceLevel);
 if (pending.timelineDays) setTimelineDays(pending.timelineDays as 30|60|90|120);
 if (pending.duration) setDuration(pending.duration as 30|45|60|90);
 if (pending.daysPerWeek) setDaysPerWeek(pending.daysPerWeek as 3|4|5|6|7);
 if (pending.equipment) setEquipment(pending.equipment as string[]);
 if (pending.autoGenerate) {
 setPendingAutoGenerate(true);
 setStep(3);
 }
 localStorage.removeItem('leanverse_pending_wizard');
 }
 } catch {}

 if (!user) return; // Don't load guest state if we are about to redirect
 
 // Load state from local storage
 const storageKey = getUserStorageKey('leanverse_transformation');
 const savedState = localStorage.getItem(storageKey);
 if (savedState) {
 try {
 const parsed = JSON.parse(savedState);
 // Ensure today's workout is populated
 if (parsed && parsed.currentDay <= parsed.totalDays) {
 const updatedState = { ...parsed };
 updatedState.schedule[parsed.currentDay - 1] = populateExercisesForDay(updatedState, parsed.currentDay - 1, dbExercises);
 setState(updatedState);
 } else {
 setState(parsed);
 }
 } catch (e) {
 console.error('Failed to parse transformation state', e);
 }
 }
 }, [user]);

 useEffect(() => {
 if (state && isMounted) {
 localStorage.setItem(getUserStorageKey('leanverse_transformation'), JSON.stringify(state));
 window.dispatchEvent(new Event('leanverse_state_changed'));
 }
 }, [state, isMounted, user]);

 useEffect(() => {
 if (pendingAutoGenerate && user) {
 setPendingAutoGenerate(false);
 handleGenerate();
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [pendingAutoGenerate, user]);



 const toggleEquipment = (eq: string) => {
 setEquipment((prev) => prev.includes(eq) ? prev.filter((item) => item !== eq) : [...prev, eq]);
 };

 const handleGenerate = () => {
 setLoading(true);
 setTimeout(async () => {
 const profile: UserProfile = {
 age: 25, // Mock default
 gender: 'male',
 height: 175,
 weight: 75,
 goal,
 location,
 experience,
 daysPerWeek,
 sessionDuration: duration,
 timelineDays,
 injuries: [],
 equipment: location === 'gym' ? ['gym', 'barbell', 'dumbbells', 'cables', 'bodyweight'] : equipment
 };
 
 let preservedStats = undefined;
 try {
 const preservedStr = localStorage.getItem(getUserStorageKey('leanverse_preserved_stats'));
 if (preservedStr) preservedStats = JSON.parse(preservedStr);
 } catch {}

 let newState = generateTransformationJourney(profile, preservedStats);
 newState.schedule[0] = populateExercisesForDay(newState, 0, dbExercises); // Populate day 1
 setState(newState);
 setLoading(false);
 
 const confetti = (await import('canvas-confetti')).default;
 confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
 }, 1500);
 };

 const handleLogChange = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', val: string) => {
 setLogs((prev) => {
 const exLogs = prev[exerciseId] ? [...prev[exerciseId]] : [];
 if (!exLogs[setIndex]) exLogs[setIndex] = { weight: '', reps: '' };
 exLogs[setIndex] = { ...exLogs[setIndex], [field]: val };
 return { ...prev, [exerciseId]: exLogs };
 });
 };

 const handleCompleteWorkout = () => {
 if (!state) return;
 
 const dayIndex = state.currentDay - 1;
 const prevDay = dayIndex > 0 ? state.schedule[dayIndex - 1] : null;
 
 if (prevDay && prevDay.dateCompleted && new Date(prevDay.dateCompleted).toDateString() === new Date().toDateString()) {
 alert("You've already conquered today's mission! Rest up and come back tomorrow.");
 return;
 }

 const day = state.schedule[dayIndex];
 
 const completionLogs = day.mainExercises.map(ex => ({
 exerciseId: ex.exerciseId,
 sets: Array.from({ length: ex.targetSets }).map((_, i) => ({
 reps: parseInt(logs[ex.id]?.[i]?.reps || ex.targetReps.split('-')[0] || '10'),
 weight: logs[ex.id]?.[i]?.weight || 'Bodyweight'
 }))
 }));

 let newState = logWorkoutCompletion(state, dayIndex, completionLogs);
 
 // Move to next day
 if (newState.currentDay < newState.totalDays) {
 newState.currentDay++;
 newState.schedule[newState.currentDay - 1] = populateExercisesForDay(newState, newState.currentDay - 1, dbExercises);
 }
 
 setState(newState);
 setLogs({}); // Clear logs for next day
 setViewDayIndex(newState.currentDay - 1);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const handleAddExtraExercise = (dbExerciseId: string) => {
 if (!state) return;
 const exerciseSource = dbExercises.length > 0 ? dbExercises : transformationExercises;
 const dbExercise = exerciseSource.find(e => e.id === dbExerciseId || e._id === dbExerciseId);
 if (!dbExercise) return;
 
 const dayIndex = state.currentDay - 1;
 const newState = { ...state, schedule: [...state.schedule] };
 const day = { ...newState.schedule[dayIndex] };
 
 if (day.mainExercises.some(ex => ex.exerciseId === dbExerciseId)) {
 alert('This exercise is already in your routine today.');
 return;
 }
 
 if (day.mainExercises.some(ex => areExercisesSimilar(ex.name, dbExercise.name))) {
 alert('A very similar exercise is already in your routine today. Pick something different for better muscle stimulation!');
 return;
 }

 const newEx: WorkoutExercise = {
 id: crypto.randomUUID(),
 exerciseId: dbExercise.id || dbExercise._id,
 name: dbExercise.name,
 muscleGroup: dbExercise.muscleGroup,
 pattern: dbExercise.pattern || dbExercise.category || '',
 imageUrl: dbExercise.imageUrl,
 targetSets: 3,
 targetReps: '10-12',
 targetWeight: 'Auto-regulate',
 restSeconds: 60,
 completed: false,
 loggedSets: []
 };
 
 day.mainExercises = [...day.mainExercises, newEx];
 newState.schedule[dayIndex] = day;
 
 setState(newState);
 setShowExerciseSearch(false);
 setExerciseSearch('');
 };

 const handleCreateExercise = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!user) return;
 setCreating(true);
 try {
 const res = await fetch('/api/exercises', {
 method: editExerciseId ? 'PUT' : 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 id: editExerciseId,
 userId: user.id,
 name: cfName,
 muscleGroup: cfMuscle,
 equipment: cfEquipment,
 category: cfCategory,
 description: cfDescription,
 }),
 });
 const data = await res.json();
 if (res.ok && data.exercise) {
 if (editExerciseId) {
 setDbExercises(prev => prev.map(ex => (ex._id || ex.id) === editExerciseId ? data.exercise : ex));
 } else {
 setDbExercises(prev => [data.exercise, ...prev]);
 handleAddExtraExercise(data.exercise._id || data.exercise.id);
 }
 setShowCreateExercise(false);
 setEditExerciseId(null);
 setCfName(''); setCfMuscle('Chest'); setCfEquipment('Bodyweight'); setCfCategory('Strength'); setCfDescription('');
 }
 } catch {}
 setCreating(false);
 };

 const handleEditExercisePrompt = (ex: any) => {
 setEditExerciseId(ex._id || ex.id);
 setCfName(ex.name);
 setCfMuscle(ex.muscleGroup || 'Chest');
 setCfEquipment(ex.equipment || 'Bodyweight');
 setCfCategory(ex.category || 'Strength');
 setCfDescription(ex.description || '');
 setShowCreateExercise(true);
 };

 const handleRemoveExercise = (exerciseId: string) => {
 if (!state || !confirm('Remove this exercise?')) return;
 const dayIndex = state.currentDay - 1;
 const newState = { ...state, schedule: [...state.schedule] };
 const day = { ...newState.schedule[dayIndex] };
 
 day.mainExercises = day.mainExercises.filter(ex => ex.id !== exerciseId);
 newState.schedule[dayIndex] = day;
 setState(newState);
 };

 const handleToggleExerciseComplete = (exerciseId: string) => {
 if (!state) return;
 const dayIndex = state.currentDay - 1;
 const newState = { ...state, schedule: [...state.schedule] };
 const day = { ...newState.schedule[dayIndex] };
 
 const targetEx = day.mainExercises.find(ex => ex.id === exerciseId);
 if (!targetEx) return;

 if (!targetEx.completed) {
 const exLogs = logs[exerciseId] || [];
 const isComplete = Array.from({ length: targetEx.targetSets }).every((_, i) => {
 const setLog = exLogs[i];
 return setLog && setLog.weight.trim() !== '' && String(setLog.reps).trim() !== '';
 });

 if (!isComplete) {
 alert('Please log all weights and reps before marking this exercise as complete.');
 return;
 }
 }
 
 day.mainExercises = day.mainExercises.map(ex => 
 ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
 );
 newState.schedule[dayIndex] = day;
 setState(newState);
 };

 const handleUpdateSets = (exerciseId: string, delta: number) => {
 if (!state) return;
 const dayIndex = state.currentDay - 1;
 const newState = { ...state, schedule: [...state.schedule] };
 const day = { ...newState.schedule[dayIndex] };
 
 day.mainExercises = day.mainExercises.map(ex => {
 if (ex.id === exerciseId) {
 const newSets = Math.max(1, Math.min(4, ex.targetSets + delta));
 return { ...ex, targetSets: newSets };
 }
 return ex;
 });
 
 newState.schedule[dayIndex] = day;
 setState(newState);
 };

 const handleMakeRestDay = () => {
 if (!state) return;
 const displayDayIndex = viewDayIndex >= 0 ? viewDayIndex : (state.currentDay - 1);
 if (displayDayIndex < state.currentDay - 1) return; // Cannot modify past days
 
 if (!confirm('Are you sure you want to make this a rest day? Any exercises for this day will be removed.')) return;
 
 const newState = { ...state, schedule: [...state.schedule] };
 const day = { ...newState.schedule[displayDayIndex] };
 day.isRestDay = true;
 day.mainExercises = [];
 day.warmup = ['Hydration', 'Light stretching', 'Walking'];
 newState.schedule[displayDayIndex] = day;
 setState(newState);
 };

 const handleMakeWorkoutDay = () => {
 if (!state) return;
 const displayDayIndex = viewDayIndex >= 0 ? viewDayIndex : (state.currentDay - 1);
 if (displayDayIndex < state.currentDay - 1) return; 
 
 const newState = { ...state, schedule: [...state.schedule] };
 const day = { ...newState.schedule[displayDayIndex] };
 day.isRestDay = false;
 newState.schedule[displayDayIndex] = day;
 setState(newState);
 };

 const resetJourney = () => {
 if (confirm('Are you sure you want to discard your current transformation journey? All progress will be lost.')) {
 if (state) {
 try {
 const preserved = {
 xp: state.xp,
 level: state.level,
 levelName: state.levelName,
 streak: state.streak,
 longestStreak: state.longestStreak,
 badges: state.badges,
 exerciseHistory: state.exerciseHistory,
 workoutsCompleted: state.workoutsCompleted,
 workoutsSkipped: state.workoutsSkipped
 };
 localStorage.setItem(getUserStorageKey('leanverse_preserved_stats'), JSON.stringify(preserved));
 } catch {}
 }
 localStorage.removeItem(getUserStorageKey('leanverse_transformation'));
 localStorage.removeItem('leanverse_pending_wizard');
 window.location.href = '/';
 }
 };

 const getExerciseImage = (muscleGroup?: string, pattern?: string, name?: string, imageUrl?: string, exerciseId?: string) => {
 if (imageUrl) return imageUrl;

 // Check DB exercises in case this was loaded from older localstorage
 if (exerciseId && dbExercises && dbExercises.length > 0) {
 const dbMatch = dbExercises.find(e => (e.id || e._id) === exerciseId);
 if (dbMatch && dbMatch.imageUrl) return dbMatch.imageUrl;
 }

 const mg = (muscleGroup || '').toLowerCase();
 const p = (pattern || '').toLowerCase();
 const n = (name || '').toLowerCase();

 // Cardio
 if (mg.includes('cardio') || p === 'cardio') return '/images/cardio_run.webp';

 // Abs/Core
 if (mg.includes('abs') || mg.includes('core')) {
 if (n.includes('plank') || n.includes('twist') || p === 'core_iso') return '/images/abs_plank.webp';
 return '/images/abs_crunch.webp';
 }

 // Legs
 if (mg.includes('leg') || mg.includes('glute') || mg.includes('calf')) {
 if (p === 'lunge' || n.includes('lunge') || n.includes('split squat')) return '/images/legs_lunge.webp';
 if (n.includes('extension') || n.includes('curl') || n.includes('calf raise') || n.includes('glute bridge')) return '/images/legs_isolation.webp';
 if (p === 'hinge' || n.includes('deadlift') || n.includes('rdl') || n.includes('good morning')) return '/images/back.webp'; // Deadlifts
 return '/images/legs_squat.webp'; // Squats and default
 }

 // Back
 if (mg.includes('back')) {
 if (n.includes('pull up') || n.includes('chin up') || n.includes('pulldown') || p === 'vertical_pull') return '/images/back_pullup.webp';
 return '/images/back_row.webp';
 }

 // Chest
 if (mg.includes('chest')) {
 if (n.includes('fly') || n.includes('pec deck') || n.includes('cable crossover')) return '/images/chest_fly.webp';
 return '/images/chest_press.webp';
 }

 // Shoulders
 if (mg.includes('shoulder')) {
 if (n.includes('lateral') || n.includes('raise') || n.includes('fly') || n.includes('face pull') || n.includes('upright row')) return '/images/shoulders_lateral.webp';
 return '/images/shoulders_press.webp';
 }

 // Arms
 if (mg.includes('bicep')) return '/images/biceps.webp';
 if (mg.includes('tricep')) return '/images/triceps.webp';

 // Fallback
 return '/images/chest_press.webp';
 };

 if (authLoading || pendingAutoGenerate || loading) {
 return (
 <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 animate-fade-in">
 <RotateCcw className="w-10 h-10 animate-spin text-emerald-500" />
 <h2 className="text-xl font-black text-foreground">Generating AI Transformation...</h2>
 <p className="text-sm text-muted font-bold">Optimizing your path to success</p>
 </div>
 );
 }
 
 if (!user || !isMounted) return null;

 const renderWizard = () => (
 <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border max-w-2xl mx-auto">
 <div className="flex items-center space-x-3 mb-6">
 <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
 <Dumbbell className="w-6 h-6" />
 </div>
 <div>
 <h1 className="text-xl sm:text-2xl font-black tracking-wide text-foreground">
 Transformation Journey Engine
 </h1>
 <p className="text-xs text-muted mt-0.5">
 Build a personalized, gamified, multi-phase fitness journey.
 </p>
 </div>
 </div>

 <div className="flex items-center space-x-2 mb-8">
 <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-secondary dark:bg-card/10'}`} />
 <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-secondary dark:bg-card/10'}`} />
 </div>

 {step === 1 && (
 <div className="space-y-5 animate-fade-in">
 <span className="text-xs font-black text-muted uppercase tracking-widest block mb-4">Step 1: Focus & Timeline</span>
 
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div className="space-y-1">
 <span className="text-xs font-bold text-muted block ml-1">Transformation Goal</span>
 <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="w-full bg-secondary/50 border border-border/20 dark:border-border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
 <option value="muscle">Muscle Building</option>
 <option value="fatloss">Fat Loss</option>
 <option value="leanbulk">Lean Bulk</option>
 <option value="strength">Strength</option>
 <option value="recomp">Body Recomposition</option>
 </select>
 </div>
 <div className="space-y-1">
 <span className="text-xs font-bold text-muted block ml-1">Journey Length</span>
 <select value={timelineDays} onChange={(e) => setTimelineDays(parseInt(e.target.value))} className="w-full bg-secondary/50 border border-border/20 dark:border-border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
 <option value="30">30 Days (Quick Reset)</option>
 <option value="60">60 Days (Transformation)</option>
 <option value="90">90 Days (Complete Rebuild)</option>
 <option value="120">120 Days (Elite Journey)</option>
 </select>
 </div>
 <div className="space-y-1">
 <span className="text-xs font-bold text-muted block ml-1">Duration</span>
 <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value) as any)} className="w-full bg-secondary/50 border border-border/20 dark:border-border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
 <option value="30">30 min</option>
 <option value="45">45 min</option>
 <option value="60">60 min</option>
 <option value="90">90 min</option>
 </select>
 </div>
 </div>

 {goal !== 'custom plan' && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1">
 <span className="text-xs font-bold text-muted block ml-1">Experience</span>
 <select value={experience} onChange={(e) => setExperience(e.target.value as ExperienceLevel)} className="w-full bg-secondary/50 border border-border/20 dark:border-border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
 <option value="beginner">Beginner</option>
 <option value="intermediate">Intermediate</option>
 <option value="advanced">Advanced</option>
 </select>
 </div>
 <div className="space-y-1">
 <span className="text-xs font-bold text-muted block ml-1">Days / Week</span>
 <select value={daysPerWeek} onChange={(e) => setDaysPerWeek(parseInt(e.target.value) as any)} className="w-full bg-secondary/50 border border-border/20 dark:border-border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
 <option value="3">3 Days</option>
 <option value="4">4 Days</option>
 <option value="5">5 Days</option>
 <option value="6">6 Days</option>
 </select>
 </div>
 </div>
 )}

 {goal === 'custom plan' ? (
 <button onClick={handleGenerate} disabled={loading} className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-1 cursor-pointer">
 {loading ? <RotateCcw className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1 text-amber-300" />}
 <span>Build Custom Journey</span>
 </button>
 ) : (
 <button onClick={() => setStep(2)} className="w-full mt-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer">
 <span>Next Phase</span>
 <ChevronRight className="w-4 h-4" />
 </button>
 )}
 </div>
 )}

 {step === 2 && (
 <div className="space-y-5 animate-fade-in">
 <span className="text-xs font-black text-muted uppercase tracking-widest block mb-4">Step 2: Environment & Gear</span>
 
 <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/50 dark:bg-card/5 border border-border/10 rounded-2xl mb-4">
 <button onClick={() => setLocation('gym')} className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${location === 'gym' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted'}`}>Commercial Gym</button>
 <button onClick={() => setLocation('home')} className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${location === 'home' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted'}`}>Home Setup</button>
 </div>

 {location === 'home' ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 {[{id: 'dumbbells', name: 'Dumbbells'}, {id: 'barbell', name: 'Barbell'}, {id: 'cables', name: 'Cables'}, {id: 'bodyweight', name: 'Bodyweight Only'}].map((eq) => (
 <button
 key={eq.id} onClick={() => toggleEquipment(eq.id)}
 className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${equipment.includes(eq.id) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-border/10 bg-secondary/50 dark:bg-card/5 text-muted'}`}
 >
 <Dumbbell className="w-4 h-4 shrink-0" />
 <span>{eq.name}</span>
 </button>
 ))}
 </div>
 ) : (
 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
 <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Commercial Gym Selected: All equipment unlocked!</span>
 </div>
 )}

 <div className="flex space-x-3 mt-6">
 <button onClick={() => setStep(1)} className="flex-1 py-3 bg-secondary/50 dark:bg-card/5 text-muted rounded-2xl font-bold transition-all cursor-pointer">Back</button>
 <button onClick={handleGenerate} disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-1 cursor-pointer">
 {loading ? <RotateCcw className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1 text-amber-300" />}
 <span>Build Journey</span>
 </button>
 </div>
 </div>
 )}
 </div>
 );

 const renderDashboard = () => {
 if (!state) return null;
 
 const displayDayIndex = viewDayIndex >= 0 ? viewDayIndex : (state.currentDay - 1);
 const activeDay = state.schedule[displayDayIndex] || state.schedule[state.totalDays - 1];
 const isPastDay = displayDayIndex < (state.currentDay - 1);
 const isFutureDay = displayDayIndex > (state.currentDay - 1);
 
 const progressPercent = Math.round((state.currentDay / state.totalDays) * 100);
 const allCompleted = activeDay.isRestDay || (activeDay.mainExercises.length > 0 && activeDay.mainExercises.every(ex => ex.completed));
 
 const prevDay = state.currentDay > 1 ? state.schedule[state.currentDay - 2] : null;
 const isAlreadyWorkedOutToday = prevDay?.dateCompleted ? new Date(prevDay.dateCompleted).toDateString() === new Date().toDateString() : false;
 
 const canComplete = allCompleted && !isAlreadyWorkedOutToday && !isPastDay && !isFutureDay;

 return (
 <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
 {/* Dashboard Header */}
 <div className="glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
 
 <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
 <div>
 <div className="flex items-center space-x-2 text-emerald-500 font-extrabold text-xs uppercase tracking-widest mb-2">
 <Target className="w-4 h-4" />
 <span>{activeDay.phaseName}</span>
 </div>
 <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
 Day {state.currentDay} <span className="text-muted">/ {state.totalDays}</span>
 </h1>
 <p className="text-sm text-muted max-w-xl">
 Keep pushing. Your {state.profile.goal} transformation is {progressPercent}% complete.
 </p>
 </div>
 
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto mt-6 md:mt-0">
 <div className="bg-secondary/50 dark:bg-card/5 p-4 rounded-2xl border border-border/50 dark:border-border">
 <div className="flex items-center space-x-1.5 text-amber-500 mb-1">
 <Flame className="w-4 h-4 fill-current" />
 <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
 </div>
 <div className="text-2xl font-black text-foreground">{state.streak} Days</div>
 </div>
 <div className="bg-secondary/50 dark:bg-card/5 p-4 rounded-2xl border border-border/50 dark:border-border min-w-[120px]">
 <div className="flex items-center space-x-1.5 text-blue-500 mb-1">
 <Star className="w-4 h-4 fill-current" />
 <span className="text-xs font-bold uppercase tracking-wider">XP Points</span>
 </div>
 <div className="text-2xl font-black text-foreground">{state.xp}</div>
 </div>
 <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-4 rounded-2xl shadow-lg text-white col-span-2 sm:col-span-1">
 <div className="flex items-center space-x-1.5 mb-1 text-emerald-100">
 <Shield className="w-4 h-4" />
 <span className="text-xs font-bold uppercase tracking-wider">Rank</span>
 </div>
 <div className="text-2xl font-black">{state.levelName}</div>
 </div>
 </div>
 </div>

 {/* Progress Bar */}
 <div className="mt-8">
 <div className="w-full h-2.5 bg-secondary dark:bg-card/10 rounded-full overflow-hidden">
 <div 
 className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all duration-1000 ease-out relative"
 style={{ width: `${progressPercent}%` }}
 >
 <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30"></div>
 </div>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 {/* Main Daily Mission */}
 <div className="lg:col-span-8 space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <span className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
 <Activity className="w-5 h-5 text-emerald-500 shrink-0" />
 <span className="truncate">{isPastDay ? "Completed Mission" : isFutureDay ? "Upcoming Mission" : "Today's Mission"}: {activeDay.workoutName}</span>
 </span>
 <span className="text-xs font-bold text-muted bg-secondary/50 dark:bg-card/5 px-3 py-1.5 rounded-full border border-border/10 w-fit">
 ~{activeDay.estimatedMinutes} mins
 </span>
 </div>

 <div className="flex justify-between items-center bg-secondary/50 dark:bg-card/5 rounded-2xl p-2 mb-4 border border-border/50 dark:border-border">
 <button 
 onClick={() => setViewDayIndex(Math.max(0, displayDayIndex - 1))} 
 disabled={displayDayIndex === 0}
 className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${displayDayIndex === 0 ? 'text-muted opacity-50 cursor-not-allowed' : 'text-foreground hover:bg-card dark:hover:bg-card/10 shadow-sm cursor-pointer'}`}
 >
 &larr; Previous
 </button>
 <div className="text-center">
 <span className="text-[10px] sm:text-xs font-black text-muted uppercase tracking-widest block">Viewing</span>
 <span className={`text-xs sm:text-sm font-bold ${isPastDay ? 'text-emerald-500' : 'text-foreground'}`}>
 Day {displayDayIndex + 1} {isPastDay ? '(Completed)' : ''}
 </span>
 </div>
 <button 
 onClick={() => setViewDayIndex(Math.min(state.currentDay - 1, displayDayIndex + 1))} 
 disabled={displayDayIndex >= state.currentDay - 1}
 className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${displayDayIndex >= state.currentDay - 1 ? 'text-muted opacity-50 cursor-not-allowed' : 'text-foreground hover:bg-card dark:hover:bg-card/10 shadow-sm cursor-pointer'}`}
 >
 Next &rarr;
 </button>
 </div>

 <div className="glass p-6 sm:p-8 rounded-3xl border border-border/10 space-y-6">
 {activeDay.isRestDay ? (
 <div className="text-center py-12">
 <div className="text-5xl mb-4">🧘</div>
 <h3 className="text-2xl font-black text-foreground mb-2">Active Recovery Day</h3>
 <p className="text-muted max-w-md mx-auto mb-8">
 Your muscles grow outside the gym. Focus on hydration, light mobility, and sleep today.
 </p>
 <button 
 onClick={handleCompleteWorkout} 
 disabled={isAlreadyWorkedOutToday}
 className={`px-8 py-4 font-bold rounded-2xl shadow-lg transition-all cursor-pointer text-lg mb-4 block mx-auto ${isAlreadyWorkedOutToday ? 'bg-secondary text-muted cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
 >
 {isAlreadyWorkedOutToday ? 'Come Back Tomorrow!' : 'Mark Rest Day Complete (+50 XP)'}
 </button>
 
 {!isPastDay && (
 <button 
 onClick={handleMakeWorkoutDay}
 className="text-xs font-bold text-muted hover:text-emerald-500 transition-colors underline underline-offset-4"
 >
 Wait, I want to workout today instead
 </button>
 )}
 </div>
 ) : (
 <>
 {/* Warmup Section */}
 <div className="space-y-3">
 <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Phase 1: Warmup</h4>
 <div className="grid grid-cols-2 gap-2">
 {activeDay.warmup.map((w, i) => (
 <span key={i} className="text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1.5 rounded-lg border border-amber-500/20 text-center flex items-center justify-center leading-tight">{w}</span>
 ))}
 </div>
 </div>

 {/* Main Workout Exercises */}
 <div className="space-y-4 pt-4 border-t border-border/10">
 <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Phase 2: Main Routine</h4>
 {activeDay.mainExercises.map((ex, idx) => {
 const history = state.exerciseHistory?.[ex.exerciseId];
 const lastSession = history && history.length > 0 ? history[history.length - 1] : null;
 // Find the max weight they used last time (for display purposes)
 const maxLastWeight = lastSession ? 
 Math.max(...lastSession.weightUsed.map(w => parseFloat(w) || 0)) : 0;
 
 return (
 <div key={ex.id} className={`p-4 sm:p-5 rounded-2xl space-y-4 group transition-all ${ex.completed ? 'bg-emerald-500/5 border border-emerald-500/30' : 'bg-secondary/40 dark:bg-card/5 border border-border/5'}`}>
 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
 <div className={`flex gap-4 items-start ${ex.completed ? 'opacity-60' : ''}`}>
 <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-border/10 shadow-inner bg-secondary relative group-hover:scale-105 transition-transform duration-500">
 <img src={getExerciseImage(ex.muscleGroup, ex.pattern, ex.name, ex.imageUrl, ex.exerciseId)} alt={ex.name} className="w-full h-full object-cover" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
 <span className="absolute bottom-2 right-2 text-[10px] font-black tracking-widest uppercase text-background">{ex.muscleGroup || 'Exercise'}</span>
 </div>
 <div>
 <span className="text-xs font-black text-emerald-500 mb-1 block">EXERCISE 0{idx + 1}</span>
 <h5 className="font-bold text-lg text-foreground leading-tight mb-1">{ex.name}</h5>
 <p className="text-xs text-muted font-semibold">{ex.targetSets} Sets • {ex.targetReps} Reps • {ex.restSeconds}s Rest</p>
 
 {/* Progressive Overload Note */}
 {lastSession && !ex.completed && (
 <div className="mt-2 inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg border border-amber-500/20">
 <Flame className="w-3 h-3" />
 <span>Last time: {maxLastWeight > 0 ? `${maxLastWeight}kg` : 'Bodyweight'}. Try to add weight or reps today! 📈</span>
 </div>
 )}
 </div>
 </div>
 <div className="flex items-center space-x-2 shrink-0">
 <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 shrink-0 text-center hidden sm:block">
 {ex.targetWeight}
 </div>
 <button onClick={() => handleToggleExerciseComplete(ex.id)} className={`p-2 rounded-lg transition-colors hidden sm:block ${ex.completed ? 'text-emerald-500 bg-emerald-500/10 opacity-100' : 'text-muted hover:text-emerald-500 hover:bg-emerald-500/10 opacity-0 group-hover:opacity-100'}`}>
 <CheckCircle2 className="w-4 h-4" />
 </button>
 <button onClick={() => handleRemoveExercise(ex.id)} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors hidden sm:block opacity-0 group-hover:opacity-100">
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Logging UI */}
 <div className={`space-y-2 pt-3 border-t border-border/10 transition-opacity ${ex.completed && !isPastDay ? 'opacity-50 pointer-events-none' : ''}`}>
 {Array.from({ length: ex.targetSets }).map((_, setIdx) => {
 const pastLog = isPastDay && ex.loggedSets ? ex.loggedSets[setIdx] : null;
 const weightVal = isPastDay ? (pastLog?.weight || '') : (logs[ex.id]?.[setIdx]?.weight || '');
 const repsVal = isPastDay ? (pastLog?.reps || '') : (logs[ex.id]?.[setIdx]?.reps || '');
 
 return (
 <div key={setIdx} className="flex items-center gap-2 w-full">
 <div className="bg-secondary/50 dark:bg-card/5 rounded-lg w-8 h-9 flex items-center justify-center shrink-0">
 <span className="text-xs font-black text-muted">{setIdx + 1}</span>
 </div>
 <input 
 type="text" 
 placeholder="Weight" 
 value={weightVal}
 readOnly={isPastDay || ex.completed}
 onChange={(e) => handleLogChange(ex.id, setIdx, 'weight', e.target.value)}
 className={`min-w-0 flex-1 border rounded-xl px-3 py-2 text-sm font-bold text-center sm:text-left ${isPastDay ? 'bg-background dark:bg-card/5 border-transparent text-muted cursor-not-allowed' : 'bg-card border-border/20 dark:border-border text-foreground focus:outline-emerald-500'}`}
 />
 <span className="text-muted font-bold shrink-0">×</span>
 <input 
 type="number" 
 placeholder="Reps" 
 value={repsVal}
 readOnly={isPastDay || ex.completed}
 onChange={(e) => handleLogChange(ex.id, setIdx, 'reps', e.target.value)}
 className={`min-w-0 w-16 sm:w-20 border rounded-xl px-2 py-2 text-sm font-bold text-center shrink-0 ${isPastDay ? 'bg-background dark:bg-card/5 border-transparent text-muted cursor-not-allowed' : 'bg-card border-border/20 dark:border-border text-foreground focus:outline-emerald-500'}`}
 />
 </div>
 );
 })}
 
 {/* Add/Remove Sets Controls */}
 {!isPastDay && !ex.completed && (
 <div className="flex justify-between items-center pt-2 px-1">
 <button 
 onClick={() => handleUpdateSets(ex.id, -1)} 
 disabled={ex.targetSets <= 1}
 className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${ex.targetSets <= 1 ? 'opacity-30 cursor-not-allowed border-border text-muted' : 'border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer'}`}
 >
 - Remove Set
 </button>
 <span className="text-[10px] font-black text-muted uppercase tracking-widest">{ex.targetSets} Sets Limit: 4</span>
 <button 
 onClick={() => handleUpdateSets(ex.id, 1)} 
 disabled={ex.targetSets >= 4}
 className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${ex.targetSets >= 4 ? 'opacity-30 cursor-not-allowed border-border text-muted' : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 cursor-pointer'}`}
 >
 + Add Set
 </button>
 </div>
 )}
 </div>
 {!isPastDay && (
 <div className="flex gap-2 mt-2 sm:hidden">
 <button onClick={() => handleToggleExerciseComplete(ex.id)} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${ex.completed ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted bg-secondary/50 dark:bg-card/5'}`}>
 {ex.completed ? 'Completed' : 'Mark Complete'}
 </button>
 <button onClick={() => handleRemoveExercise(ex.id)} className="flex-1 py-2 text-xs font-bold text-red-500 bg-red-500/5 rounded-xl">
 Remove
 </button>
 </div>
 )}
 </div>
 );
 })}
 {activeDay.mainExercises.length === 0 && (
 <div className="text-center py-8 bg-secondary/50 dark:bg-card/5 rounded-2xl border border-dashed border-border mb-4">
 <span className="text-4xl mb-3 block">🏗️</span>
 <p className="text-sm font-bold text-muted mb-1">Your routine is empty.</p>
 <p className="text-xs text-muted">Tap below to add your first exercise.</p>
 </div>
 )}
 
 {!isPastDay && (
 <div className="flex flex-col sm:flex-row gap-3 w-full">
 <button 
 onClick={() => setShowExerciseSearch(true)}
 className="flex-1 py-3 rounded-xl border-2 border-dashed border-border text-muted font-bold text-xs hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center justify-center space-x-1 cursor-pointer"
 >
 <Plus className="w-4 h-4" />
 <span>Add Extra Exercise</span>
 </button>
 <button 
 onClick={handleMakeRestDay}
 className="flex-1 py-3 rounded-xl border-2 border-dashed border-border text-muted font-bold text-xs hover:border-blue-500/50 hover:text-blue-500 hover:bg-blue-500/5 transition-all flex items-center justify-center space-x-2 cursor-pointer"
 >
 <span className="text-base leading-none">🧘</span>
 <span>Make Rest Day</span>
 </button>
 </div>
 )}
 </div>

 {/* Finisher & Cooldown */}
 <div className="space-y-3 pt-4 border-t border-border/10">
 <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Phase 3: Finisher & Cooldown</h4>
 <div className="flex flex-col gap-2">
 <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl border border-red-500/20 text-sm font-bold">🔥 Finisher: {activeDay.finisher}</div>
 <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 rounded-xl border border-blue-500/20 text-sm font-bold">❄️ Cooldown: {activeDay.cooldown.join(', ')}</div>
 </div>
 </div>

 {!isPastDay ? (
 <button 
 onClick={handleCompleteWorkout} 
 disabled={!canComplete}
 className={`w-full mt-4 py-4 font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 ${canComplete ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white cursor-pointer' : 'bg-secondary dark:bg-card/5 text-muted cursor-not-allowed opacity-50'}`}
 >
 <span>{isAlreadyWorkedOutToday ? 'Come Back Tomorrow!' : allCompleted ? 'Mission Complete (+250 XP)' : 'Complete All Exercises First'}</span>
 <ArrowRight className="w-5 h-5" />
 </button>
 ) : (
 <div className="w-full mt-4 py-4 font-black text-lg rounded-2xl bg-secondary dark:bg-card/5 text-emerald-500 flex items-center justify-center space-x-2 border border-border/50 dark:border-border">
 <CheckCircle2 className="w-5 h-5" />
 <span>Workout Completed</span>
 </div>
 )}
 </>
 )}
 </div>
 </div>

 {/* Sidebar */}
 <div className="lg:col-span-4 space-y-6 order-first lg:order-last">
 {/* Options */}
 <div className="glass p-6 rounded-3xl border border-border/10 text-center">
 <button onClick={resetJourney} className="w-full py-3 rounded-xl border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 transition-all cursor-pointer text-sm">
 Abandon Journey & Reset
 </button>
 </div>
 </div>
 </div>

 {/* Exercise Search Modal */}
 {showExerciseSearch && (
 <div
 className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 bg-black/60 backdrop-blur-sm"
 onClick={(e) => { if (e.target === e.currentTarget) { setShowExerciseSearch(false); setExerciseSearch(''); } }}
 >
 <div className="w-full max-w-lg bg-background rounded-3xl shadow-2xl border border-border/20 dark:border-border overflow-hidden flex flex-col max-h-[80vh] animate-fade-in">

 {/* Modal Header */}
 <div className="flex items-center justify-between p-5 border-b border-border/10">
 <div className="flex items-center space-x-2">
 <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
 <Dumbbell className="w-4 h-4" />
 </div>
 <div>
 <h2 className="font-black text-foreground text-sm">Add Extra Exercise</h2>
 <p className="text-[10px] text-muted font-bold">Search from database</p>
 </div>
 </div>
 <button
 onClick={() => { setShowExerciseSearch(false); setExerciseSearch(''); }}
 className="p-2 rounded-xl text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Search Input */}
 <div className="px-5 pt-4 pb-2">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
 <input
 ref={searchInputRef}
 type="text"
 placeholder="Search exercises... e.g. Squat, Curl"
 value={exerciseSearch}
 onChange={(e) => setExerciseSearch(e.target.value)}
 autoFocus
 className="w-full pl-9 pr-4 py-2.5 bg-secondary/80 dark:bg-card/5 border border-border/50 dark:border-border rounded-2xl text-sm font-bold text-foreground placeholder-slate-400 focus:outline-none focus:border-emerald-500"
 />
 {exerciseSearch && (
 <button
 onClick={() => setExerciseSearch('')}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted cursor-pointer"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 {user && (
 <button
 onClick={() => setShowCreateExercise(true)}
 className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-bold rounded-xl transition-colors cursor-pointer"
 >
 <Plus className="w-4 h-4" />
 <span>Create Custom Exercise</span>
 </button>
 )}
 </div>

 {/* Search Results */}
 <div className="overflow-y-auto p-2">
 {(dbExercises.length > 0 ? dbExercises : transformationExercises)
 .filter((ex: any) => exerciseSearch === '' || ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()))
 .slice(0, 50)
 .map((ex: any) => (
 <div key={ex.id || ex._id} className="relative group flex items-center justify-between p-2 sm:p-3 rounded-2xl hover:bg-secondary dark:hover:bg-card/5 transition-colors text-left border border-transparent hover:border-border dark:hover:border-white/5">
 <button
 onClick={() => handleAddExtraExercise(ex.id || ex._id)}
 className="flex-1 flex flex-col items-start cursor-pointer"
 >
 <div className="font-bold text-sm text-foreground">{ex.name}</div>
 <div className="text-[10px] text-muted font-semibold">{ex.muscleGroup} • {ex.requiredEquipment ? ex.requiredEquipment.join(', ') : (ex.equipment || 'None')}</div>
 </button>
 <div className="flex items-center space-x-1 shrink-0">
 {ex.createdBy === user?.id && (
 <button onClick={() => handleEditExercisePrompt(ex)} className="p-2 sm:p-2.5 rounded-xl text-muted hover:text-amber-500 hover:bg-amber-500/10 cursor-pointer transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Edit Custom Exercise">
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
 </button>
 )}
 <button onClick={() => handleAddExtraExercise(ex.id || ex._id)} className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors" title="Add to Workout">
 <Plus className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* Create Exercise Modal */}
 {showCreateExercise && (
 <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
 <div
 className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
 onClick={() => setShowCreateExercise(false)}
 />
 <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-fade-in">
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-border/50 dark:border-border">
 <div className="flex items-center space-x-3">
 <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
 <Plus className="w-5 h-5" />
 </div>
 <div>
 <h2 className="font-black text-foreground text-lg">{editExerciseId ? 'Edit Custom Exercise' : 'Create Custom Exercise'}</h2>
 <p className="text-xs text-muted font-bold">Only visible to you</p>
 </div>
 </div>
 <button
 onClick={() => { setShowCreateExercise(false); setEditExerciseId(null); }}
 className="p-2 rounded-xl text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleCreateExercise} className="p-6 space-y-5">
 {/* Exercise Name */}
 <div className="space-y-1.5">
 <label className="text-xs font-black text-muted uppercase tracking-widest">Exercise Name *</label>
 <input
 type="text"
 required
 placeholder="e.g. My Cable Chest Squeeze"
 value={cfName}
 onChange={(e) => setCfName(e.target.value)}
 className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-violet-500 transition-all"
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 {/* Muscle Group */}
 <div className="space-y-1.5">
 <label className="text-xs font-black text-muted uppercase tracking-widest">Target Muscle *</label>
 <select
 value={cfMuscle}
 onChange={(e) => setCfMuscle(e.target.value)}
 className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-violet-500 transition-all"
 >
 {muscleOptions.map(m => <option key={m} value={m}>{m}</option>)}
 </select>
 </div>

 {/* Equipment */}
 <div className="space-y-1.5">
 <label className="text-xs font-black text-muted uppercase tracking-widest">Equipment</label>
 <select
 value={cfEquipment}
 onChange={(e) => setCfEquipment(e.target.value)}
 className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-violet-500 transition-all"
 >
 {equipmentOptions.map(eq => <option key={eq} value={eq}>{eq}</option>)}
 </select>
 </div>
 </div>

 {/* Category */}
 <div className="space-y-1.5">
 <label className="text-xs font-black text-muted uppercase tracking-widest">Category</label>
 <div className="flex flex-wrap gap-2">
 {categoryOptions.map(c => (
 <button
 key={c}
 type="button"
 onClick={() => setCfCategory(c)}
 className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
 cfCategory === c
 ? 'bg-violet-500 border-violet-500 text-white'
 : 'bg-secondary border-border text-muted'
 }`}
 >
 {c}
 </button>
 ))}
 </div>
 </div>

 {/* Description */}
 <div className="space-y-1.5">
 <label className="text-xs font-black text-muted uppercase tracking-widest">Description (optional)</label>
 <textarea
 placeholder="How to perform this exercise, any personal tips..."
 value={cfDescription}
 onChange={(e) => setCfDescription(e.target.value)}
 rows={3}
 className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-violet-500 transition-all resize-none"
 />
 </div>

 <button
 type="submit"
 disabled={creating || !cfName}
 className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {creating ? (
 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
 ) : (
 <Plus className="w-4 h-4" />
 )}
 <span>{creating ? (editExerciseId ? 'Saving...' : 'Creating...') : (editExerciseId ? 'Save Changes' : 'Create & Add to Workout')}</span>
 </button>
 </form>
 </div>
 </div>
 )}
 </div>
 );
 };

 return (
 <div className="max-w-6xl mx-auto px-4 py-8">
 {state ? renderDashboard() : renderWizard()}
 </div>
 );
}
