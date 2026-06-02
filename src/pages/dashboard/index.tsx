import { useState, useMemo } from 'react';
import { SlidersHorizontal, BarChart3, PieChart } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import DashboardSection from './components/DashboardSection';
import DashboardFilters from './components/DashboardFilters';
import DashboardCards from './components/DashboardCards';
import DashboardCharts from './components/DashboardCharts';
import { FilterSkeleton, KPICardsSkeleton, ChartsSkeleton } from './components/DashboardSkeleton';

export default function DashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const { summaryStats, branchStats, dailyBranchData, isLoading } = useDashboardStats({ branch: selectedBranch, period: selectedPeriod }) as any;

  const branchesList = useMemo(() => {
    if (!branchStats || !branchStats.length) return [];
    return branchStats.map((stat: any) => stat.branch).filter(Boolean);
  }, [branchStats]);

  // Check if it's the very first load (no data fetched yet)
  const isInitialLoad = isLoading && branchesList.length === 0;

  return (
    <div className="flex flex-col gap-8 text-left">

      {/* Filters */}
      <DashboardSection
        icon={<SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />}
        label="ตัวกรองแดชบอร์ด (Dashboard Filters)"
      >
        {isInitialLoad ? (
          <FilterSkeleton />
        ) : (
          <DashboardFilters
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            branches={branchesList}
            isLoading={isLoading}
          />
        )}
      </DashboardSection>

      {/* KPI Cards */}
      <DashboardSection
        icon={<BarChart3 className="h-3.5 w-3.5 text-slate-400" />}
        label="ดัชนีชี้วัดหลัก (KPI & Metrics)"
        rightSlot={
          !isLoading && (selectedBranch || selectedPeriod) && (
            <div className="flex items-center gap-2">
              {selectedBranch && (
                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-3 py-1 text-[10px] font-extrabold text-[#0051bb] dark:text-blue-300 tracking-wide">
                  สาขา: {selectedBranch}
                </span>
              )}
              {selectedPeriod && (
                <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-3 py-1 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-300 tracking-wide">
                  {selectedPeriod === '7d' ? '7 วันล่าสุด' : selectedPeriod === '1m' ? '1 เดือนล่าสุด' : '3 เดือนล่าสุด'}
                </span>
              )}
            </div>
          )
        }
      >
        {isLoading ? (
          <KPICardsSkeleton />
        ) : (
          <DashboardCards
            summaryStats={summaryStats}
          />
        )}
      </DashboardSection>

      {/* Charts */}
      <DashboardSection
        icon={<PieChart className="h-3.5 w-3.5 text-slate-400" />}
        label="การวิเคราะห์และแนวโน้มความพึงพอใจ (Charts & Graphs)"
      >
        {isLoading ? (
          <ChartsSkeleton />
        ) : (
          <DashboardCharts
            branchStats={branchStats}
            dailyBranchData={dailyBranchData}
            summaryStats={summaryStats}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
        )}
      </DashboardSection>

    </div>
  );
}
