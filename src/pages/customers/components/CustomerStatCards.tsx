import { useState, useEffect, useCallback } from 'react';
import { Users, CheckCircle2, AlertTriangle, FileCheck2, Loader2 } from 'lucide-react';
import { fetchSummary } from '../../../services/statsService';

interface CustomerStatCardsProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
  isLoading: boolean;
  borderColorClass: string;
  activeBgClass: string;
  iconColorClass: string;
}

const STAT_CONFIG = [
  { 
    key: 'all', 
    label: 'ลูกค้าทั้งหมด', 
    statusVal: '', 
    color: '#0051BA', 
    icon: Users,
    borderColorClass: 'border-blue-500', 
    activeBgClass: 'bg-blue-50/70 border-blue-500 shadow-[0_12px_28px_-10px_rgba(0,81,186,0.35),0_0_0_3px_rgba(0,81,186,0.15)]',
    iconColorClass: 'text-[#0051BA] bg-blue-50' 
  },
  { 
    key: 'active', 
    label: 'ผ่อนชำระปกติ', 
    statusVal: 'active', 
    color: '#10B981', 
    icon: CheckCircle2,
    borderColorClass: 'border-emerald-500', 
    activeBgClass: 'bg-emerald-50/70 border-emerald-500 shadow-[0_12px_28px_-10px_rgba(16,185,129,0.35),0_0_0_3px_rgba(16,185,129,0.15)]',
    iconColorClass: 'text-emerald-500 bg-emerald-50' 
  },
  { 
    key: 'overdue', 
    label: 'ค้างชำระค่างวด', 
    statusVal: 'overdue', 
    color: '#EF4444', 
    icon: AlertTriangle,
    borderColorClass: 'border-red-500', 
    activeBgClass: 'bg-red-50/70 border-red-500 shadow-[0_12px_28px_-10px_rgba(239,68,68,0.35),0_0_0_3px_rgba(239,68,68,0.15)]',
    iconColorClass: 'text-red-500 bg-red-50' 
  },
  { 
    key: 'completed', 
    label: 'จบสัญญาแล้ว', 
    statusVal: 'completed', 
    color: '#64748B', 
    icon: FileCheck2,
    borderColorClass: 'border-slate-500', 
    activeBgClass: 'bg-slate-100/70 border-slate-500 shadow-[0_12px_28px_-10px_rgba(100,116,139,0.35),0_0_0_3px_rgba(100,116,139,0.15)]',
    iconColorClass: 'text-slate-500 bg-slate-100' 
  },
];

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  isActive, 
  onClick, 
  isLoading, 
  activeBgClass, 
  iconColorClass, 
  color 
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={isLoading ? undefined : onClick}
      className={`glass-card relative overflow-hidden rounded-2xl p-5 px-6 border text-left transition-all duration-300 ${
        isActive 
          ? activeBgClass 
          : 'border-white/50 shadow-[0_8px_30px_rgba(0,81,186,0.02)] hover:border-slate-300 hover:translate-y-[-2px] hover:shadow-lg'
      } ${isLoading ? 'cursor-default pointer-events-none' : 'cursor-pointer active:scale-[0.98]'}`}
    >
      {/* Background soft glow */}
      <div 
        className="absolute -right-5 -top-5 h-14 w-14 rounded-full blur-[8px] opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 75%)` }}
      />

      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg shadow-sm ${iconColorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            <span className="text-xs font-semibold text-slate-300">กำลังโหลด...</span>
          </div>
        ) : (
          <>
            <span 
              className="text-[26px] font-extrabold leading-none tracking-tight"
              style={{ color: isActive ? color : '#1e293b' }}
            >
              {value.toLocaleString()}
            </span>
            <span className="text-[11.5px] font-bold text-slate-400 ml-1">ราย</span>
          </>
        )}
      </div>
    </button>
  );
}

export default function CustomerStatCards({ selectedStatus, setSelectedStatus }: CustomerStatCardsProps) {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary for stat cards:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const counts: Record<string, number> = {
    all:       summary?.total_customers ?? 0,
    active:    summary?.active_count ?? 0,
    overdue:   summary?.overdue_count ?? 0,
    completed: summary?.completed_count ?? 0,
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, statusVal, color, icon, borderColorClass, activeBgClass, iconColorClass }) => (
        <StatCard
          key={key}
          label={label}
          value={counts[key]}
          color={color}
          icon={icon}
          isActive={selectedStatus === statusVal}
          isLoading={isLoading}
          borderColorClass={borderColorClass}
          activeBgClass={activeBgClass}
          iconColorClass={iconColorClass}
          onClick={() =>
            setSelectedStatus(
              statusVal === '' ? '' : selectedStatus === statusVal ? '' : statusVal
            )
          }
        />
      ))}
    </div>
  );
}
