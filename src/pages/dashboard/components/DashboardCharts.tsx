import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Smile, TrendingUp } from 'lucide-react';
import {
  XAxis, YAxis, Cell, PieChart, Pie, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { DashboardChartArea } from './DashboardChartArea';
import { DashboardChartBar } from './DashboardChartBar';
import { DashboardChartLine } from './DashboardChartLine';

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
  dailyBranchData?: any[];
  summaryStats: SummaryStats;
  selectedBranch: string;
  setSelectedBranch: (val: string) => void;
  selectedPeriod?: string;
  setSelectedPeriod?: (val: string) => void;
}

export default function DashboardCharts({
  branchStats = [],
  dailyBranchData = [],
  summaryStats = { positiveCount: 0, neutralCount: 0, negativeCount: 0, weeklyCSAT: [4.0, 4.0, 4.0, 4.0] },
  selectedBranch = '',
  setSelectedBranch = () => {},
  selectedPeriod = '',
  setSelectedPeriod = () => {},
}: DashboardChartsProps) {

  // 2. Pie chart: sentiment proportion — ChartConfig for shadcn
  const sentimentConfig = {
    positive: { label: 'พอใจ (Positive)', color: '#10B981' },
    neutral: { label: 'เฉยๆ (Neutral)', color: '#F59E0B' },
    negative: { label: 'ไม่พอใจ (Negative)', color: '#EF4444' },
  } satisfies ChartConfig

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
        { name: 'positive', value: pPos, color: '#10B981', label: 'พอใจ (Positive)' },
        { name: 'neutral', value: pNeu, color: '#F59E0B', label: 'เฉยๆ (Neutral)' },
        { name: 'negative', value: pNeg, color: '#EF4444', label: 'ไม่พอใจ (Negative)' },
      ],
    };
  }, [summaryStats]);

  // 3. Line chart: weekly CSAT trend — ChartConfig for shadcn
  const csatConfig = {
    score: { label: 'CSAT Score', color: '#0051BA' },
  } satisfies ChartConfig

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

  const CardHeader = ({ iconBg, iconColor, icon, title, subtitle }: { iconBg: string; iconColor: string; icon: React.ReactNode; title: string; subtitle: string }) => (
    <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5 text-left">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} ${iconColor} shadow-md dark:shadow-none`}>
        {icon}
      </div>
      <div>
        <span className="block text-[12.5px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100">
          {title}
        </span>
        <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">{subtitle}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── 1. Area Chart: ลูกค้าจำแนกรายสาขา (Interactive Area Chart) ── */}
      <div className="w-full">
        <DashboardChartArea
          branchStats={branchStats}
          dailyBranchData={dailyBranchData}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>

      {/* ── 1.5. Bar Chart: สัดส่วนสะสมแบบแท่ง (Stacked Bar Chart) ── */}
      <div className="w-full">
        <DashboardChartBar
          branchStats={branchStats}
          dailyBranchData={dailyBranchData}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>

      {/* ── 1.7. Line Chart: แนวโน้มเปรียบเทียบแบบรายสาขา (Multiple Line Chart) ── */}
      <div className="w-full">
        <DashboardChartLine
          branchStats={branchStats}
          dailyBranchData={dailyBranchData}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>

      {/* ── 2 & 3. Sentiment & CSAT charts side by side on desktop ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* ── 2. Pie Chart: สัดส่วน Sentiment ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] dark:shadow-none border border-slate-200/50 dark:border-white/5">
          <CardHeader
            iconBg="bg-emerald-50 dark:bg-emerald-950/50" iconColor="text-emerald-500 dark:text-emerald-400"
            icon={<Smile className="h-4.5 w-4.5" />}
            title="สัดส่วน Sentiment ความรู้สึก"
            subtitle="ผลลัพธ์การวิเคราะห์อารมณ์ในข้อความติชม"
          />
          <div className="h-[260px] flex flex-col sm:flex-row items-center justify-center gap-6 px-1">
            <div className="relative h-36 w-36 shrink-0">
              <ChartContainer config={sentimentConfig} className="h-full w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        indicator="dot"
                        className="shadow-xl rounded-xl border border-slate-200/50 dark:border-white/10"
                      />
                    }
                  />
                  <Pie
                    data={sentimentData.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    nameKey="name"
                  >
                    {sentimentData.chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} style={{ filter: `drop-shadow(0 2px 4px ${entry.color}20)` }} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">เชิงบวก</span>
                <span className="text-[20px] font-extrabold text-emerald-500 dark:text-emerald-400 leading-none mt-0.5">
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
                  <div className="flex justify-between flex-1 text-[12px] font-semibold text-slate-600 dark:text-slate-400">
                    <span>{d.label.split(' (')[0]}</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100">{d.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 3. Line Chart: แนวโน้มคะแนน CSAT ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] dark:shadow-none border border-slate-200/50 dark:border-white/5">
          <CardHeader
            iconBg="bg-amber-50 dark:bg-amber-950/50" iconColor="text-amber-500 dark:text-amber-400"
            icon={<TrendingUp className="h-4.5 w-4.5" />}
            title="แนวโน้มคะแนน CSAT"
            subtitle="ค่าคะแนนเฉลี่ยความพอใจรายสัปดาห์ (1-5 ดาว)"
          />
          <div className="h-[260px]">
            <ChartContainer config={csatConfig} className="h-[260px] w-full">
              <AreaChart data={weeklyTrendsData} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0051BA" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0051BA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} domain={[1, 5]}
                  tick={{ fontSize: 9, fontWeight: 600, fill: '#94A3B8' }} tickCount={5} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      className="shadow-xl rounded-xl border border-slate-200/50 dark:border-white/10"
                    />
                  }
                />
                <Area type="monotone" dataKey="score" stroke="none" fill="url(#areaGlow)" />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-score)"
                  strokeWidth={4.5}
                  dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: 'var(--color-score)' }}
                  activeDot={{ r: 7, strokeWidth: 2.5, fill: '#ffffff', stroke: '#6366F1' }}
                  style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 81, 186, 0.2))' }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
