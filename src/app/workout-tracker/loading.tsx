export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="w-48 h-4 bg-slate-200 dark:bg-white/10 rounded mb-2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="w-3/4 h-12 bg-slate-200 dark:bg-white/10 rounded-xl" />
          <div className="w-1/2 h-10 bg-slate-200 dark:bg-white/10 rounded-xl" />
        </div>
        <div className="glass rounded-3xl p-5 border border-slate-200/10 h-32 bg-slate-200/50 dark:bg-white/5" />
      </div>
      <div className="sticky top-24 z-40 glass rounded-2xl p-4 border border-emerald-500/20 h-20 bg-slate-200/50 dark:bg-white/5" />
      <div className="space-y-6">
        <div className="glass rounded-3xl p-5 border border-slate-200/10 h-48 bg-slate-200/50 dark:bg-white/5" />
        <div className="glass rounded-3xl p-5 border border-slate-200/10 h-48 bg-slate-200/50 dark:bg-white/5" />
      </div>
    </div>
  );
}
