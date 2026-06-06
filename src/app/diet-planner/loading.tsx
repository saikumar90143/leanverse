export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-secondary dark:bg-card/10" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-1/2 bg-secondary dark:bg-card/10 rounded-md" />
            <div className="h-4 w-3/4 bg-secondary dark:bg-card/10 rounded-md" />
          </div>
        </div>
        <div className="flex space-x-2 mb-8">
          <div className="h-1.5 flex-1 rounded-full bg-secondary dark:bg-card/10" />
          <div className="h-1.5 flex-1 rounded-full bg-secondary dark:bg-card/10" />
          <div className="h-1.5 flex-1 rounded-full bg-secondary dark:bg-card/10" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-secondary dark:bg-card/10 rounded-xl" />
            <div className="h-16 bg-secondary dark:bg-card/10 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-secondary dark:bg-card/10 rounded-xl" />
            <div className="h-16 bg-secondary dark:bg-card/10 rounded-xl" />
          </div>
          <div className="h-12 bg-secondary dark:bg-card/10 rounded-2xl mt-6" />
        </div>
      </div>
    </div>
  );
}
