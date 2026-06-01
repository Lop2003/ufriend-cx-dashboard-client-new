import { motion } from 'framer-motion';
import { Users, Star, AlertTriangle, Smile } from 'lucide-react';

interface SummaryStats {
  totalCustomers: number;
  avgRating: string;
  overdueCount: number;
  satisfactionRate: string;
}

interface DashboardCardsProps {
  summaryStats?: SummaryStats;
  selectedStatus?: string;
  setSelectedStatus?: (val: string) => void;
}

export default function DashboardCards({
  summaryStats = { totalCustomers: 0, avgRating: '0.0', overdueCount: 0, satisfactionRate: '0' },
}: DashboardCardsProps) {

  const cards = [
    {
      key: '',
      title: 'ลูกค้าทั้งหมดในระบบ',
      value: summaryStats.totalCustomers.toLocaleString(),
      unit: 'ราย',
      sub: 'ยอดรวมบัญชีลูกค้าค้างชำระ & ปกติ',
      icon: Users,
      border: 'border-blue-100 dark:border-blue-900/40',
      iconBg: 'bg-blue-50 dark:bg-blue-950/50 text-[#0051bb] dark:text-blue-400',
      titleColor: 'text-[#0051bb] dark:text-blue-400',
      valueColor: 'text-slate-800 dark:text-slate-100',
      subColor: 'text-slate-500 dark:text-slate-400',
      noClick: true,
      pulse: false,
    },
    {
      key: '__avg',
      title: 'คะแนนความพึงพอใจเฉลี่ย',
      value: summaryStats.avgRating,
      unit: '/ 5.0',
      sub: 'คะแนนสะสมความสุขของลูกค้า',
      icon: Star,
      border: 'border-amber-100 dark:border-amber-900/40',
      iconBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-500 dark:text-amber-400',
      titleColor: 'text-amber-700 dark:text-amber-400',
      valueColor: 'text-slate-800 dark:text-slate-100',
      subColor: 'text-slate-500 dark:text-slate-400',
      noClick: true,
      pulse: false,
    },
    {
      key: 'overdue',
      title: 'ค้างชำระค่างวดสะสม',
      value: summaryStats.overdueCount.toLocaleString(),
      unit: 'ราย',
      sub: 'ต้องเร่งโทรเจรจาติดตามหนี้ด่วน',
      icon: AlertTriangle,
      border: 'border-red-100 dark:border-red-900/40',
      iconBg: 'bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400',
      titleColor: 'text-red-700 dark:text-red-400',
      valueColor: 'text-red-500 dark:text-red-400 font-extrabold',
      subColor: 'text-red-500 dark:text-red-400',
      noClick: true,
      pulse: true,
    },
    {
      key: '__sat',
      title: 'เปอร์เซ็นต์ความพึงพอใจ',
      value: `${summaryStats.satisfactionRate}%`,
      unit: 'ของลูกค้า',
      sub: 'ลูกค้าที่ประเมินพอใจขึ้นไป',
      icon: Smile,
      border: 'border-emerald-100 dark:border-emerald-900/40',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 dark:text-emerald-400',
      titleColor: 'text-emerald-700 dark:text-emerald-400',
      valueColor: 'text-slate-800 dark:text-slate-100',
      subColor: 'text-slate-500 dark:text-slate-400',
      noClick: true,
      pulse: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <motion.div
            key={card.key || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 25,
              delay: index * 0.08,
            }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`glass-card relative overflow-hidden rounded-2xl p-5 border text-left shadow-[0_10px_25px_-10px_rgba(0,81,186,0.04)] dark:shadow-none transition-all duration-300 ${
              card.border
            } ${
              card.pulse ? 'animate-pulse-subtle' : ''
            }`}
          >
            {/* Soft backdrop glow orb inside card */}
            <div
              className="absolute -right-8 -top-8 h-20 w-20 rounded-full blur-[10px] pointer-events-none opacity-20 dark:opacity-10"
              style={{
                background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`
              }}
            />

            <div className="flex justify-between items-center">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider ${card.titleColor}`}>
                {card.title}
              </span>
              <div
                className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                  card.iconBg
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className={`text-[32px] font-extrabold leading-none tracking-tight ${card.valueColor}`}>
                  {card.value}
                </span>
                <span className="text-[12.5px] font-bold text-slate-400 dark:text-slate-500 ml-1">
                  {card.unit}
                </span>
              </div>
              
              <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-bold text-left">
                <span
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    card.pulse ? 'bg-red-500 animate-ping' : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                  style={{ backgroundColor: card.pulse ? '#EF4444' : undefined }}
                />
                <span className={card.subColor}>{card.sub}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
