// 1. โครงร่างของแถบตัวกรองสาขา (Filter Bar Skeleton)
export function FilterSkeleton() {
  return (
    <div className="animate-pulse h-[66px] w-full rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm" />
  );
}

// 2. โครงร่างของการ์ดดัชนีชี้วัดหลัก (KPI Cards Skeleton)
export function KPICardsSkeleton() {
  const skeletonCards = [
    { border: 'border-blue-100/50 dark:border-blue-900/30', iconBg: 'bg-blue-50/50 dark:bg-blue-950/30' },
    { border: 'border-amber-100/50 dark:border-amber-900/30', iconBg: 'bg-amber-50/50 dark:bg-amber-950/30' },
    { border: 'border-red-100/50 dark:border-red-900/30', iconBg: 'bg-red-50/50 dark:bg-red-950/30' },
    { border: 'border-emerald-100/50 dark:border-emerald-900/30', iconBg: 'bg-emerald-50/50 dark:bg-emerald-950/30' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {skeletonCards.map((card, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-2xl border bg-white/80 dark:bg-white/[0.03] p-5 shadow-[0_10px_25px_-10px_rgba(0,81,186,0.04)] dark:shadow-none ${card.border}`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="h-4.5 w-24 bg-slate-200 dark:bg-white/10 rounded-md" />
            <div className={`h-8.5 w-8.5 rounded-lg ${card.iconBg}`} />
          </div>
          <div className="h-8 w-20 bg-slate-200 dark:bg-white/10 rounded-lg mb-4" />
          <div className="h-3 w-36 bg-slate-100 dark:bg-white/5 rounded-md" />
        </div>
      ))}
    </div>
  );
}

// 3. โครงร่างของกราฟการวิเคราะห์ (Charts & Graphs Skeleton)
export function ChartsSkeleton() {
  const skeletonCharts = [
    { iconBg: 'bg-blue-50/50 dark:bg-blue-950/30', border: 'border-blue-100/50 dark:border-blue-900/30' },
    { iconBg: 'bg-emerald-50/50 dark:bg-emerald-950/30', border: 'border-emerald-100/50 dark:border-emerald-900/30' },
    { iconBg: 'bg-amber-50/50 dark:bg-amber-950/30', border: 'border-amber-100/50 dark:border-amber-900/30' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {skeletonCharts.map((chart, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-[24px] border bg-white/70 dark:bg-white/[0.03] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] dark:shadow-none ${chart.border}`}
        >
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5">
            <div className={`h-9 w-9 rounded-lg ${chart.iconBg}`} />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 bg-slate-200 dark:bg-white/10 rounded-md" />
              <div className="h-3 w-20 bg-slate-100 dark:bg-white/5 rounded-md" />
            </div>
          </div>
          <div className="h-[260px] w-full bg-slate-100 dark:bg-white/[0.03] rounded-xl" />
        </div>
      ))}
    </div>
  );
}
