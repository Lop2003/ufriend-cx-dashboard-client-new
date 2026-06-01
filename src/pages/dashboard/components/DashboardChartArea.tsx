"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Store, X } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"


import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
export interface DashboardChartAreaProps {
  branchStats?: Array<{ branch: string; customer_count: number; [key: string]: any }>
  dailyBranchData?: Array<{ date: string; [key: string]: string | number }>
  selectedBranch: string
  setSelectedBranch: (branch: string) => void
}

// 3. SHADCN/UI CHART CONFIGURATION mapping Thai branch names to specific hex colors
const baseChartConfig: ChartConfig = {
  "สยาม": { label: "สาขาสยาม", color: "#0051BA" },
  "ลาดพร้าว": { label: "สาขาลาดพร้าว", color: "#0ea5e9" },
  "เมกาบางนา": { label: "สาขาเมกาบางนา", color: "#10b981" },
  "ฟิวเจอร์พาร์ค": { label: "สาขาฟิวเจอร์พาร์ค", color: "#f59e0b" },
  "รังสิต": { label: "สาขารังสิต", color: "#6366f1" },
  "บางนา": { label: "สาขาบางนา", color: "#ef4444" },
  "ปิ่นเกล้า": { label: "สาขาปิ่นเกล้า", color: "#8b5cf6" },
  "พระราม 9": { label: "สาขาพระราม 9", color: "#ec4899" },
  "วงเวียนใหญ่": { label: "สาขาวงเวียนใหญ่", color: "#14b8a6" },
}

export function DashboardChartArea({
  branchStats = [],
  dailyBranchData,
  selectedBranch,
  setSelectedBranch,
}: DashboardChartAreaProps) {
  // 1. COMPONENT PROPS & DATA STRUCTURE:
  // Fallback to generating a 7-day time series if dailyBranchData is not provided
  const chartData = useMemo(() => {
    if (dailyBranchData && dailyBranchData.length > 0) {
      return dailyBranchData
    }

    const days = ["23 พ.ค.", "24 พ.ค.", "25 พ.ค.", "26 พ.ค.", "27 พ.ค.", "28 พ.ค.", "29 พ.ค."]
    const activeBranches =
      branchStats && branchStats.length > 0
        ? branchStats.map((s) => s.branch).filter(Boolean)
        : ["สยาม", "ลาดพร้าว", "เมกาบางนา", "ฟิวเจอร์พาร์ค", "รังสิต", "บางนา", "ปิ่นเกล้า", "พระราม 9", "วงเวียนใหญ่"]

    return days.map((date, index) => {
      const row: { date: string; [key: string]: string | number } = { date }
      activeBranches.forEach((branch) => {
        const stat = branchStats?.find((s) => s.branch === branch)
        const totalCount = stat ? stat.customer_count : 100

        // Stable seeded random values per branch for realistic curves
        const seed = branch.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const val = Math.sin(index + seed)
        const factor = (val + 1) / 2 // 0 to 1
        row[branch] = Math.max(10, Math.round(totalCount * (0.55 + factor * 0.45)))
      })
      return row
    })
  }, [dailyBranchData, branchStats])

  // Extract all dynamic branch keys (excluding 'date')
  const branchKeys = useMemo(() => {
    if (!chartData || chartData.length === 0) return []
    return Object.keys(chartData[0]).filter((key) => key !== "date")
  }, [chartData])

  // Fully compiled chart configuration with fallback styling for unrecognized branches
  const fullChartConfig = useMemo(() => {
    const config = { ...baseChartConfig }
    branchKeys.forEach((branch) => {
      if (!config[branch]) {
        const hash = branch.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const hue = hash % 360
        config[branch] = {
          label: `สาขา${branch}`,
          color: `hsl(${hue}, 70%, 50%)`,
        }
      }
    })
    return config
  }, [branchKeys])

  // Dynamic header strings
  const isBranchSelected = !!selectedBranch
  const title = isBranchSelected
    ? `แนวโน้มรายวัน: สาขา${selectedBranch}`
    : "แนวโน้มยอดลูกค้าและสัดส่วนสาขา"
  const subtitle = isBranchSelected
    ? "แสดงแนวโน้มจำนวนลูกค้าที่รับบริการรายวัน"
    : "แสดงสัดส่วนลูกค้าแยกตามสาขาและแนวโน้มการเติบโต"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0 }}
      className="glass-card rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] dark:shadow-none border border-slate-200/50 dark:border-white/5 text-left"
    >
      <div className="flex flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0051BA] dark:text-blue-400 shadow-sm dark:shadow-none">
            <Store className="h-4.5 w-4.5" />
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

        {/* Clear filter pill button shown when selectedBranch is active */}
        {isBranchSelected && (
          <button
            onClick={() => setSelectedBranch("")}
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-[#0051bb] dark:text-blue-400 px-3.5 py-1 text-[11px] font-extrabold tracking-wide transition-all shadow-xs cursor-pointer"
          >
            <span>ดูภาพรวมทุกสาขา</span>
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      
      <div className="h-[260px]">
        <ChartContainer
          config={fullChartConfig}
          className="h-[260px] w-full aspect-auto"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
          >
            <defs>
              {branchKeys.map((branch) => {
                const color = fullChartConfig[branch]?.color || "#94a3b8"
                return (
                  <linearGradient
                    key={branch}
                    id={`fill-${branch}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.01} />
                  </linearGradient>
                )
              })}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.15)"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 9, fontWeight: 700, fill: "#64748B" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 9, fontWeight: 600, fill: "#94A3B8" }}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="bg-slate-900/95 text-slate-100 border-none shadow-xl rounded-xl"
                />
              }
            />
            
            {/* 2. CONDITIONAL RENDERING LOGIC: */}
            {isBranchSelected ? (
              /* MODE B: Single Area Chart for the selected branch */
              <Area
                key={selectedBranch}
                dataKey={selectedBranch}
                type="monotone"
                fill={`url(#fill-${selectedBranch})`}
                stroke={`var(--color-${selectedBranch})`}
                strokeWidth={3}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  stroke: fullChartConfig[selectedBranch]?.color || "#0051BA",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  stroke: fullChartConfig[selectedBranch]?.color || "#0051BA",
                }}
              />
            ) : (
              /* MODE A: Stacked Area Chart for all branch layers */
              branchKeys.map((branch) => (
                <Area
                  key={branch}
                  dataKey={branch}
                  type="monotone"
                  fill={`url(#fill-${branch})`}
                  stroke={`var(--color-${branch})`}
                  stackId="1"
                  strokeWidth={2}
                />
              ))
            )}
          </AreaChart>
        </ChartContainer>
      </div>
    </motion.div>
  )
}
