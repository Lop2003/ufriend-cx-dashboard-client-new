import { useMemo } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { Smile, TrendingUp } from "lucide-react";
import {
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
// import { DashboardChartArea } from "./DashboardChartArea";
// import { DashboardChartBar } from "./DashboardChartBar";
import { DashboardChartLine } from "./DashboardChartLine";

interface BranchStat {
  branch: string;
  customer_count: number;
}

interface SummaryStats {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  weeklyCSAT: number[];
  avgRating?: string;
}

interface DashboardChartsProps {
  branchStats: BranchStat[];
  dailyBranchData?: Array<{ date: string; [key: string]: string | number }>;
  summaryStats: SummaryStats;
  selectedBranch: string;
  setSelectedBranch: (val: string) => void;
  selectedPeriod?: string;
  setSelectedPeriod?: (val: string) => void;
}

function CardHeader({
  iconBg,
  iconColor,
  icon,
  title,
  subtitle,
}: {
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5 text-left">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} ${iconColor} shadow-md dark:shadow-none`}
      >
        {icon}
      </div>
      <div>
        <span className="block text-[12.5px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100">
          {title}
        </span>
        <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export default function DashboardCharts({
  branchStats = [],
  dailyBranchData = [],
  summaryStats = {
    positiveCount: 0,
    neutralCount: 0,
    negativeCount: 0,
    weeklyCSAT: [4.0, 4.0, 4.0, 4.0],
  },
  selectedBranch = "",
  setSelectedBranch = () => {},
  selectedPeriod = "",
  setSelectedPeriod = () => {},
}: DashboardChartsProps) {
  // 2. Pie chart: sentiment proportion — ChartConfig for shadcn
  const sentimentConfig = {
    positive: { label: "พอใจ (Positive)", color: "#10B981" },
    neutral: { label: "เฉยๆ (Neutral)", color: "#F59E0B" },
    negative: { label: "ไม่พอใจ (Negative)", color: "#EF4444" },
  } satisfies ChartConfig;

  const sentimentData = useMemo(() => {
    const total =
      summaryStats.positiveCount +
        summaryStats.neutralCount +
        summaryStats.negativeCount || 1;
    const pos = summaryStats.positiveCount;
    const neu = summaryStats.neutralCount;
    const neg = summaryStats.negativeCount;
    const pPos = Math.round((pos / total) * 100);
    const pNeu = Math.round((neu / total) * 100);
    const pNeg = Math.round((neg / total) * 100);
    return {
      percentage: pPos,
      total,
      chartData: [
        {
          name: "positive",
          value: pPos,
          count: pos,
          color: "#10B981",
          label: "พอใจ (Positive)",
        },
        {
          name: "neutral",
          value: pNeu,
          count: neu,
          color: "#F59E0B",
          label: "เฉยๆ (Neutral)",
        },
        {
          name: "negative",
          value: pNeg,
          count: neg,
          color: "#EF4444",
          label: "ไม่พอใจ (Negative)",
        },
      ],
    };
  }, [summaryStats]);

  // CSAT derived stats: avg, max, min, latest value, and trend delta
  const csatStats = useMemo(() => {
    const scores = summaryStats.weeklyCSAT?.length
      ? summaryStats.weeklyCSAT
      : [4.0];
    const avg = parseFloat(summaryStats.avgRating || "0") || (scores.reduce((s, v) => s + v, 0) / scores.length);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const latest = scores[scores.length - 1] ?? avg;
    const prev = scores[scores.length - 2] ?? latest;
    const delta = parseFloat((latest - prev).toFixed(2));
    return { avg, max, min, latest, delta };
  }, [summaryStats.weeklyCSAT, summaryStats.avgRating]);

  // Build dynamic subtitle for sentiment chart based on active filters
  const sentimentSubtitle = useMemo(() => {
    const parts: string[] = [];
    if (selectedBranch) parts.push(`สาขา${selectedBranch}`);
    if (selectedPeriod === "7d") parts.push("7 วันล่าสุด");
    else if (selectedPeriod === "1m") parts.push("1 เดือนล่าสุด");
    else if (selectedPeriod === "3m") parts.push("3 เดือนล่าสุด");
    const filterText = parts.length > 0 ? ` (${parts.join(" · ")})` : "";
    return `ผลลัพธ์การวิเคราะห์อารมณ์จากรีวิว ${sentimentData.total.toLocaleString()} รายการ${filterText}`;
  }, [selectedBranch, selectedPeriod, sentimentData.total]);

  // 3. Line chart: weekly CSAT trend — ChartConfig for shadcn
  const csatConfig = {
    score: { label: "CSAT Score", color: "#0051BA" },
  } satisfies ChartConfig;

  // Build dynamic subtitle for CSAT chart based on active filters
  const csatSubtitle = useMemo(() => {
    const parts: string[] = [];
    if (selectedBranch) parts.push(`สาขา${selectedBranch}`);
    if (selectedPeriod === "7d") parts.push("7 วันล่าสุด");
    else if (selectedPeriod === "1m") parts.push("1 เดือนล่าสุด");
    else if (selectedPeriod === "3m") parts.push("3 เดือนล่าสุด");
    const filterText = parts.length > 0 ? ` (${parts.join(" · ")})` : "";

    let baseTitle = "ค่าคะแนนเฉลี่ยความพอใจรายสัปดาห์ (1-5 ดาว)";
    if (selectedPeriod === "7d") {
      baseTitle = "ค่าคะแนนเฉลี่ยความพอใจรายวัน (1-5 ดาว)";
    }
    return `${baseTitle}${filterText}`;
  }, [selectedBranch, selectedPeriod]);

  const weeklyTrendsData = useMemo(() => {
    const csat = summaryStats.weeklyCSAT || [4.0, 4.0, 4.0, 4.0];
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const now = new Date();
    const len = csat.length;

    return csat.map((score, i) => {
      if (selectedPeriod === "7d") {
        const dateOffset = -(len - 1 - i);
        const targetDate = new Date(
          now.getTime() + dateOffset * 24 * 60 * 60 * 1000,
        );
        const day = targetDate.getDate();
        const month = thaiMonths[targetDate.getMonth()];
        return {
          name: `${day} ${month}`,
          score: score,
        };
      } else {
        const startOffset = -(len - i) * 7;
        const endOffset = -(len - 1 - i) * 7;

        const startDate = new Date(
          now.getTime() + startOffset * 24 * 60 * 60 * 1000,
        );
        const endDate = new Date(
          now.getTime() + endOffset * 24 * 60 * 60 * 1000,
        );

        const startDay = startDate.getDate();
        const startMonth = thaiMonths[startDate.getMonth()];

        const endDay = endDate.getDate();
        const endMonth = thaiMonths[endDate.getMonth()];

        const dateLabel =
          startMonth === endMonth
            ? `${startDay}-${endDay} ${startMonth}`
            : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;

        return {
          name: dateLabel,
          score: score,
        };
      }
    });
  }, [summaryStats, selectedPeriod]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── 1. Area Chart: ลูกค้าจำแนกรายสาขา (Interactive Area Chart) ── */}
      {/* <div className="w-full">
        <DashboardChartArea
          branchStats={branchStats}
          dailyBranchData={dailyBranchData}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div> */}

      {/* ── 1.5. Bar Chart: สัดส่วนสะสมแบบแท่ง (Stacked Bar Chart) ── */}
      {/* <div className="w-full">
        <DashboardChartBar
          branchStats={branchStats}
          dailyBranchData={dailyBranchData}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div> */}

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
        {/* ── 2. Pie Chart: สัดส่วน Sentiment ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] dark:shadow-none border border-slate-200/50 dark:border-white/5 flex flex-col h-full"
        >
          <CardHeader
            iconBg="bg-emerald-50 dark:bg-emerald-950/50"
            iconColor="text-emerald-500 dark:text-emerald-400"
            icon={<Smile className="h-4.5 w-4.5" />}
            title="สัดส่วน Sentiment ความรู้สึก"
            subtitle={sentimentSubtitle}
          />

          {/* Donut chart — centered, larger, glowing segments */}
          <div className="flex flex-col items-center gap-5 flex-1 justify-between">
            <div className="relative h-52 w-52">
              {/* Ambient glow ring behind the chart */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/5 dark:bg-emerald-400/10 blur-xl" />
              <ChartContainer
                config={sentimentConfig}
                className="h-full w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        indicator="dot"
                        className="shadow-xl rounded-xl border border-slate-200/50 dark:border-white/10 backdrop-blur-xl"
                      />
                    }
                  />
                  <Pie
                    data={sentimentData.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={94}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    nameKey="name"
                    isAnimationActive
                    animationBegin={200}
                    animationDuration={900}
                    animationEasing="ease-out"
                  >
                    {sentimentData.chartData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={entry.color}
                        style={{
                          filter: `drop-shadow(0 4px 10px ${entry.color}55)`,
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              {/* Center callout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-0.5">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  เชิงบวก
                </span>
                <span className="text-[34px] font-extrabold leading-none tracking-tight text-emerald-500 dark:text-emerald-400">
                  {sentimentData.percentage}
                  <span className="text-[20px]">%</span>
                </span>
                <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500">
                  {sentimentData.total.toLocaleString()} รีวิว
                </span>
              </div>
            </div>

            {/* Progress-bar legend — animated bars replace simple dots */}
            <div className="w-full flex flex-col gap-3.5 pt-1">
              {sentimentData.chartData.map((d, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: d.color,
                          boxShadow: `0 0 7px ${d.color}CC`,
                        }}
                      />
                      <span className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
                        {d.label.split(" (")[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[12px] font-extrabold tabular-nums"
                        style={{ color: d.color }}
                      >
                        {d.value}%
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                        {d.count.toLocaleString()} ราย
                      </span>
                    </div>
                  </div>

                  {/* Thin track + animated fill bar */}
                  <div className="h-[5px] w-full rounded-full bg-slate-100 dark:bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.value}%` }}
                      transition={{
                        duration: 1.1,
                        delay: 0.4 + idx * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: d.color,
                        boxShadow: `0 0 10px ${d.color}55`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer summary strip */}
            <div className="w-full mt-1 grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/[0.06] rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-100/80 dark:border-white/[0.06] overflow-hidden">
              {sentimentData.chartData.map((d, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center py-2.5 gap-0.5"
                >
                  <span
                    className="text-[13px] font-extrabold tabular-nums leading-none"
                    style={{ color: d.color }}
                  >
                    {d.count.toLocaleString()}
                  </span>
                  <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 leading-none">
                    {d.label.split(" (")[0]}
                  </span>
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
          className="glass-card rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] dark:shadow-none border border-slate-200/50 dark:border-white/5 flex flex-col h-full"
        >
          <CardHeader
            iconBg="bg-amber-50 dark:bg-amber-950/50"
            iconColor="text-amber-500 dark:text-amber-400"
            icon={<TrendingUp className="h-4.5 w-4.5" />}
            title="แนวโน้มคะแนน CSAT"
            subtitle={csatSubtitle}
          />

          <div className="flex flex-col gap-4 flex-1 justify-between">

            {/* ── Area + Line chart — fills all remaining space ── */}
            <div className="flex-1 min-h-[200px]">
              <ChartContainer
                config={csatConfig}
                className="h-full w-full aspect-auto"
              >
                <AreaChart
                  data={weeklyTrendsData}
                  margin={{ top: 8, right: 8, left: -28, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="csatAreaFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#0051BA"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="80%"
                        stopColor="#0051BA"
                        stopOpacity={0.03}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(148, 163, 184, 0.12)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    minTickGap={45}
                    tick={{ fontSize: 9, fontWeight: 700, fill: "#64748B" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[1, 5]}
                    tick={{ fontSize: 9, fontWeight: 600, fill: "#94A3B8" }}
                    tickCount={5}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        className="shadow-xl rounded-xl border border-slate-200/50 dark:border-white/10 backdrop-blur-xl"
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="none"
                    fill="url(#csatAreaFill)"
                    tooltipType="none"
                    legendType="none"
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0051BA"
                    strokeWidth={3}
                    dot={{
                      r: 4.5,
                      strokeWidth: 2,
                      fill: "#ffffff",
                      stroke: "#0051BA",
                    }}
                    activeDot={{
                      r: 6.5,
                      strokeWidth: 2,
                      fill: "#ffffff",
                      stroke: "#0051BA",
                    }}
                    style={{
                      filter: "drop-shadow(0 3px 8px rgba(0, 81, 186, 0.35))",
                    }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* ── Footer stats strip ── */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/[0.06] rounded-xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-100/80 dark:border-white/[0.06] overflow-hidden">
              <div className="flex flex-col items-center py-2.5 gap-0.5">
                <span className="text-[13px] font-extrabold tabular-nums leading-none text-[#0051BA] dark:text-blue-400">
                  {csatStats.avg.toFixed(1)}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 leading-none">
                  เฉลี่ย
                </span>
              </div>
              <div className="flex flex-col items-center py-2.5 gap-0.5">
                <span className="text-[13px] font-extrabold tabular-nums leading-none text-emerald-500 dark:text-emerald-400">
                  {csatStats.max.toFixed(1)}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 leading-none">
                  สูงสุด
                </span>
              </div>
              <div className="flex flex-col items-center py-2.5 gap-0.5">
                <span className="text-[13px] font-extrabold tabular-nums leading-none text-rose-500 dark:text-rose-400">
                  {csatStats.min.toFixed(1)}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 leading-none">
                  ต่ำสุด
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
