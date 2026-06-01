import { Search, Filter, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  branches: string[];
  isLoading?: boolean;
  resetFilters?: () => void;
  hasFilters?: boolean;
}

export default function CustomerFilterBar({
  searchQuery,
  setSearchQuery,
  selectedBranch,
  setSelectedBranch,
  selectedStatus,
  setSelectedStatus,
  branches = [],
  isLoading = false,
  resetFilters,
  hasFilters = false,
}: CustomerFilterBarProps) {
  return (
    <div className="glass-card flex flex-wrap items-center gap-4 rounded-2xl p-4 px-5 shadow-[0_8px_30px_rgba(0,81,186,0.03)] dark:shadow-none text-left">
      
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อลูกค้า, รหัสสัญญา, เบอร์โทรศัพท์, หรือสินค้าผ่อนชำระ..."
          className="pl-10 pr-10 h-10 w-full rounded-xl text-[12.5px] font-semibold border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-sm transition-all focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="hidden lg:flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <Filter className="h-4 w-4" />
          <span className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 tracking-wide">
            ตัวกรองเพิ่มเติม:
          </span>
        </div>

        {/* Branch Filter Select */}
        <div className="w-full sm:w-[170px] flex-1 sm:flex-none">
          <Select
            value={selectedBranch || "ALL_BRANCHES"}
            onValueChange={(val) => setSelectedBranch(val === "ALL_BRANCHES" ? "" : val)}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 text-[12px] font-bold text-slate-700 dark:text-slate-300">
              <SelectValue placeholder="เลือกสาขา" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200/80 dark:border-white/10">
              <SelectItem value="ALL_BRANCHES" className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                สาขา: ทุกพื้นที่สาขา
              </SelectItem>
              {branches.map((br) => (
                <SelectItem key={br} value={br} className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                  สาขา: {br}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter Select */}
        <div className="w-full sm:w-[170px] flex-1 sm:flex-none">
          <Select
            value={selectedStatus || "ALL_STATUSES"}
            onValueChange={(val) => setSelectedStatus(val === "ALL_STATUSES" ? "" : val)}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 text-[12px] font-bold text-slate-700 dark:text-slate-300">
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200/80 dark:border-white/10">
              <SelectItem value="ALL_STATUSES" className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                สถานะ: ทั้งหมดในระบบ
              </SelectItem>
              <SelectItem value="active" className="text-[12px] font-bold text-emerald-500 dark:text-emerald-400">
                ปกติ (Active)
              </SelectItem>
              <SelectItem value="overdue" className="text-[12px] font-bold text-red-500 dark:text-red-400">
                ค้างชำระ (Overdue)
              </SelectItem>
              <SelectItem value="completed" className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                จบสัญญา (Completed)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button (framer-motion) */}
        <AnimatePresence>
          {hasFilters && resetFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 text-[12px] font-extrabold text-rose-600 dark:text-rose-400 shadow-sm dark:shadow-none transition-all hover:bg-rose-100/80 dark:hover:bg-rose-900/30 active:scale-95 w-full sm:w-auto justify-center"
            >
              <RotateCcw className="h-3.5 w-3.5 animate-[spin_15s_infinite_linear]" />
              ล้างตัวกรอง
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
