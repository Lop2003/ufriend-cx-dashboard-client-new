import { Skeleton } from '@/components/ui/skeleton';

/**
 * LoginSkeleton — placeholder ขณะตรวจสอบ session
 * ออกแบบ Layout ให้ตรงกับหน้า Login จริงเพื่อลดการสั่นสะเทือนของโครงสร้างหน้าจอ (Cumulative Layout Shift)
 */
export function LoginSkeleton() {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#F4F8FC] dark:bg-[#0a0e1a] antialiased md:grid md:grid-cols-12 select-none">
      
      {/* LEFT COLUMN: Mockup preview skeleton (Hidden on Mobile/Tablet < md) */}
      <div className="relative hidden md:col-span-6 lg:col-span-7 md:flex flex-col justify-between p-12 lg:p-16 bg-gradient-to-br from-[#00287D] via-[#0047A5] to-[#011646] text-white">
        
        {/* Top brand header skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="space-y-1.5">
            <Skeleton className="h-4.5 w-24 bg-white/20" />
            <Skeleton className="h-2.5 w-32 bg-white/10" />
          </div>
        </div>

        {/* Middle slogans & stats cards skeletons */}
        <div className="my-auto flex flex-col gap-8 max-w-xl">
          <div className="space-y-4">
            <Skeleton className="h-6 w-44 rounded-full bg-white/15" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-[80%] bg-white/20" />
              <Skeleton className="h-9 w-[60%] bg-white/20" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-[70%] bg-white/10" />
              <Skeleton className="h-3 w-[50%] bg-white/10" />
            </div>
          </div>

          {/* Floating graphic mockups skeletons */}
          <div className="space-y-4 mt-4">
            {/* Widget 1 */}
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 max-w-sm">
              <div className="flex items-center gap-3">
                <Skeleton className="h-11 w-11 rounded-xl bg-white/10" />
                <div className="space-y-1.5">
                  <Skeleton className="h-2.5 w-28 bg-white/10" />
                  <Skeleton className="h-4.5 w-36 bg-white/15" />
                </div>
              </div>
              <Skeleton className="h-7 w-12 rounded-lg bg-white/10" />
            </div>

            {/* Widget 2 */}
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 max-w-md ml-6 lg:ml-12 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <Skeleton className="h-3 w-32 bg-white/10" />
                <Skeleton className="h-2 w-2 rounded-full bg-white/25" />
              </div>
              <div className="rounded-xl bg-white/5 p-2.5 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-36 bg-white/15" />
                  <Skeleton className="h-3 w-12 bg-white/10" />
                </div>
                <Skeleton className="h-3.5 w-full bg-white/10" />
              </div>
            </div>

            {/* Widget 3 */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3.5 max-w-xs ml-2">
              <Skeleton className="h-9 w-9 rounded-lg bg-white/10" />
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-20 bg-white/10" />
                <Skeleton className="h-3.5 w-40 bg-white/15" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-48 bg-white/10" />
          <Skeleton className="h-3 w-32 bg-white/10" />
        </div>
      </div>

      {/* RIGHT COLUMN: Login Card & Actions skeletons */}
      <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between min-h-screen p-8 lg:p-12">
        {/* Mobile Header skeleton */}
        <div className="flex items-center justify-between md:hidden py-2 border-b border-slate-200/40 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-white/10" />
            <Skeleton className="h-4.5 w-20 bg-slate-200 dark:bg-white/10" />
          </div>
          <Skeleton className="h-4 w-12 rounded-full bg-slate-100 dark:bg-white/5" />
        </div>

        {/* Center Card container skeleton */}
        <div className="my-auto w-full max-w-[400px] mx-auto space-y-6">
          <div className="rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/[0.03] p-7 lg:p-9 shadow-sm dark:shadow-none text-center space-y-6">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-white/5" />
              <div className="space-y-2 mt-2 w-full flex flex-col items-center">
                <Skeleton className="h-6 w-48 bg-slate-200 dark:bg-white/10" />
                <Skeleton className="h-3.5 w-[85%] bg-slate-150 dark:bg-white/5" />
                <Skeleton className="h-3.5 w-[70%] bg-slate-150 dark:bg-white/5" />
              </div>
            </div>

            <div className="mt-8 space-y-3.5">
              <Skeleton className="h-12 w-full rounded-2xl bg-slate-200 dark:bg-white/10" />
              <div className="flex justify-center">
                <Skeleton className="h-3 w-56 bg-slate-100 dark:bg-white/5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/30 dark:border-white/5 bg-white/40 dark:bg-white/[0.03] p-4 flex gap-3">
            <Skeleton className="h-5 w-5 rounded-md bg-slate-200 dark:bg-white/10 shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-3.5 w-32 bg-slate-200 dark:bg-white/10" />
              <Skeleton className="h-3 w-full bg-slate-100 dark:bg-white/5" />
              <Skeleton className="h-3 w-[80%] bg-slate-100 dark:bg-white/5" />
            </div>
          </div>
        </div>

        {/* Footer info skeleton */}
        <div className="flex justify-center md:pt-4">
          <Skeleton className="h-3 w-56 bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default LoginSkeleton;
