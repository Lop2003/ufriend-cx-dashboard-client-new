import { useMemo } from 'react';
import { Store, Smile, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Line, CartesianGrid, AreaChart, Area
} from 'recharts';

interface BranchStat {
  branch: string;
  customer_count: number;
}

interface SummaryStats {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  weeklyCSAT: number[];
}

interface DashboardChartsProps {
  branchStats: BranchStat[];
  summaryStats: SummaryStats;
  selectedBranch: string;
  setSelectedBranch: (val: string) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { name: string } }>;
  unit?: string;
}

const CustomTooltip = ({ active, payload, unit = 'ราย' }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur-md text-left">
      <span className="block text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
        {payload[0].payload.name}
      </span>
      <span className="mt-1 block text-[14px] font-extrabold text-cyan-400">
        {payload[0].value.toLocaleString()}{' '}
        <span className="text-[11px] font-semibold text-slate-400">{unit}</span>
      </span>
    </div>
  );
};

export default function DashboardCharts({
  branchStats = [],
  summaryStats = { positiveCount: 0, neutralCount: 0, negativeCount: 0, weeklyCSAT: [4.0, 4.0, 4.0, 4.0] },
  selectedBranch = '',
  setSelectedBranch = () => {},
}: DashboardChartsProps) {

  // 1. Bar chart: customers by branch
  const branchCountsData = useMemo(() => {
    const sortedStats = [...branchStats].sort((a, b) => b.customer_count - a.customer_count);
    return sortedStats.map(stat => ({
      name: stat.branch,
      count: stat.customer_count,
      isSelected: selectedBranch === stat.branch,
    }));
  }, [branchStats, selectedBranch]);

  // 2. Pie chart: sentiment proportion
  const sentimentData = useMemo(() => {
    const total = (summaryStats.positiveCount + summaryStats.neutralCount + summaryStats.negativeCount) || 1;
    const pos = summaryStats.positiveCount;
    const neu = summaryStats.neutralCount;
    const neg = summaryStats.negativeCount;
    const pPos = Math.round((pos / total) * 100);
    const pNeu = Math.round((neu / total) * 100);
    const pNeg = Math.round((neg / total) * 100);
    return {
      percentage: pPos,
      chartData: [
        { name: 'พอใจ (Positive)', value: pPos, color: '#10B981' },
        { name: 'เฉยๆ (Neutral)', value: pNeu, color: '#F59E0B' },
        { name: 'ไม่พอใจ (Negative)', value: pNeg, color: '#EF4444' },
      ],
    };
  }, [summaryStats]);

  // 3. Line chart: weekly CSAT trend
  const weeklyTrendsData = useMemo(() => {
    const csat = summaryStats.weeklyCSAT || [4.0, 4.0, 4.0, 4.0];
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const now = new Date();

    return csat.map((score, i) => {
      const startOffset = - (4 - i) * 7;
      const endOffset = - (3 - i) * 7;

      const startDate = new Date(now.getTime() + startOffset * 24 * 60 * 60 * 1000);
      const endDate = new Date(now.getTime() + endOffset * 24 * 60 * 60 * 1000);

      const startDay = startDate.getDate();
      const startMonth = thaiMonths[startDate.getMonth()];
      
      const endDay = endDate.getDate();
      const endMonth = thaiMonths[endDate.getMonth()];

      const dateLabel = startMonth === endMonth
        ? `${startDay}-${endDay} ${startMonth}`
        : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;

      return {
        name: dateLabel,
        score: score,
      };
    });
  }, [summaryStats]);

  const handleBarClick = (data: { name?: string } | undefined) => {
    if (data?.name) {
      setSelectedBranch(selectedBranch === data.name ? '' : data.name);
    }
  };

  const CardHeader = ({ iconBg, iconColor, icon, title, subtitle }: { iconBg: string; iconColor: string; icon: React.ReactNode; title: string; subtitle: string }) => (
    <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200/80 text-left">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} ${iconColor} shadow-md`}>
        {icon}
      </div>
      <div>
        <span className="block text-[12.5px] font-extrabold uppercase tracking-wider text-slate-800">
          {title}
        </span>
        <span className="block text-[11px] font-semibold text-slate-400">{subtitle}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

      {/* ── 1. Bar Chart: ลูกค้าจำแนกรายสาขา ── */}
      <div className="glass-card rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] border border-slate-200/50">
        <CardHeader
          iconBg="bg-blue-50" iconColor="text-[#0051BA]"
          icon={<Store className="h-4.5 w-4.5" />}
          title="ลูกค้าแยกรายสาขา"
          subtitle="สัญญาทั้งหมดจำแนกตามพื้นที่สาขาให้บริการ"
        />
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={branchCountsData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              onClick={(e: any) => e?.activePayload && handleBarClick(e.activePayload[0].payload)}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0051BA" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#ffdb1b" stopOpacity={0.9} />
                </linearGradient>
                <linearGradient id="barSelectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffdb1b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0051BA" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fontSize: 9, fontWeight: 600, fill: '#94A3B8' }} allowDecimals={false} />
              <RechartTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,81,186,0.03)' }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={28} cursor="pointer">
                {branchCountsData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.isSelected ? 'url(#barSelectedGradient)' : selectedBranch ? 'rgba(0, 81, 186, 0.15)' : 'url(#barGradient)'}
                    className="transition-all duration-300"
                    style={{
                      filter: entry.isSelected ? 'drop-shadow(0px 4px 10px rgba(0, 81, 186, 0.25))' : 'none'
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 2. Pie Chart: สัดส่วน Sentiment ── */}
      <div className="glass-card rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] border border-slate-200/50">
        <CardHeader
          iconBg="bg-emerald-50" iconColor="text-emerald-500"
          icon={<Smile className="h-4.5 w-4.5" />}
          title="สัดส่วน Sentiment ความรู้สึก"
          subtitle="ผลลัพธ์การวิเคราะห์อารมณ์ในข้อความติชม"
        />
        <div className="h-[260px] flex flex-col sm:flex-row items-center justify-center gap-6 px-1">
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartTooltip content={<CustomTooltip unit="%" />} />
                <Pie
                  data={sentimentData.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} style={{ filter: `drop-shadow(0 2px 4px ${entry.color}20)` }} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">เชิงบวก</span>
              <span className="text-[20px] font-extrabold text-emerald-500 leading-none mt-0.5">
                {sentimentData.percentage}%
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col w-full gap-2">
            {sentimentData.chartData.map((d, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0 shadow-md"
                  style={{ backgroundColor: d.color, boxShadow: `0 0 6px ${d.color}` }}
                />
                <div className="flex justify-between flex-1 text-[12px] font-semibold text-slate-600">
                  <span>{d.name.split(' ')[0]}</span>
                  <span className="font-extrabold text-slate-800">{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Line Chart: แนวโน้มคะแนน CSAT ── */}
      <div className="glass-card rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] border border-slate-200/50">
        <CardHeader
          iconBg="bg-amber-50" iconColor="text-amber-500"
          icon={<TrendingUp className="h-4.5 w-4.5" />}
          title="แนวโน้มคะแนน CSAT"
          subtitle="ค่าคะแนนเฉลี่ยความพอใจรายสัปดาห์ (1-5 ดาว)"
        />
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrendsData} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0051BA" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#0051BA" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} domain={[1, 5]}
                tick={{ fontSize: 9, fontWeight: 600, fill: '#94A3B8' }} tickCount={5} />
              <RechartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur-md text-left">
                      <span className="block text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
                        {payload[0].payload.name}
                      </span>
                      <span className="mt-1 block text-[13.5px] font-extrabold text-amber-500">
                        {Number(payload[0].value).toFixed(2)}{' '}
                        <span className="text-[11.5px] font-semibold text-amber-500">★</span>
                      </span>
                    </div>
                  );
                }}
              />
              <Area type="monotone" dataKey="score" stroke="none" fill="url(#areaGlow)" />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0051BA"
                strokeWidth={4.5}
                dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: '#0051BA' }}
                activeDot={{ r: 7, strokeWidth: 2.5, fill: '#ffffff', stroke: '#6366F1' }}
                style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 81, 186, 0.2))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
