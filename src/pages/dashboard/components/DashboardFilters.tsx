import { Filter, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFiltersProps {
  selectedBranch: string;
  setSelectedBranch: (val: string) => void;
  branches: string[];
  isLoading?: boolean;
}

export default function DashboardFilters({
  selectedBranch,
  setSelectedBranch,
  branches = [],
  isLoading = false,
}: DashboardFiltersProps) {
  return (
    <div className="glass-card flex flex-wrap items-center gap-4 rounded-2xl p-3.5 px-5 shadow-[0_8px_30px_rgba(0,81,186,0.03)] text-left">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0051bb]">
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0051bb]" />
          ) : (
            <Filter className="h-3.5 w-3.5" />
          )}
        </div>
        <span className="text-[12px] font-extrabold text-slate-500 tracking-wide">
          เลือกวิเคราะห์รายพื้นที่สาขา:
        </span>
      </div>

      {/* Branch Select */}
      <div className="w-full sm:w-[220px]">
        <Select
          disabled={isLoading}
          value={selectedBranch || "ALL_BRANCHES"}
          onValueChange={(val) => setSelectedBranch(val === "ALL_BRANCHES" ? "" : val)}
        >
          <SelectTrigger className={`h-9 w-full rounded-xl text-[12px] font-bold transition-all duration-300 ${
            selectedBranch 
              ? 'border-[#0051bb] bg-blue-50/45 text-[#0051bb] shadow-[0_0_15px_rgba(0,81,186,0.12),0_0_0_2px_rgba(0,81,186,0.05)]' 
              : 'border-slate-200/80 bg-white/70 text-slate-700 hover:border-slate-300'
          }`}>
            <SelectValue placeholder="เลือกสาขา" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200/80">
            <SelectItem value="ALL_BRANCHES" className="text-[12px] font-bold text-slate-500">
              สาขา: ทุกพื้นที่สาขา (All)
            </SelectItem>
            {branches.map((br) => (
              <SelectItem key={br} value={br} className="text-[12px] font-semibold text-slate-700">
                สาขา: {br}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
