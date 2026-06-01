import { ArrowUpDown, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCustomerStatus } from '../../../utils/statusHelpers';
import { formatContractId, formatPhone } from '../../../utils/formatters';

interface Customer {
  id: string;
  name: string;
  phone: string;
  product: string;
  branch: string;
  plan_months: number;
  status: string;
}

interface CustomerTableProps {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  onRowClick: (id: string) => void;
  isLoading?: boolean;
}

const HEAD_CELLS = [
  { id: 'created_at', label: 'รหัสสัญญา', sortable: true },
  { id: 'name',       label: 'ชื่อลูกค้าตามสัญญา', sortable: true },
  { id: 'phone',      label: 'เบอร์โทรศัพท์', sortable: false },
  { id: 'product',    label: 'สินค้าผ่อนชำระ', sortable: true },
  { id: 'branch',     label: 'พื้นที่สาขา', sortable: false },
  { id: 'plan_months', label: 'ระยะเวลาสัญญา', sortable: true },
  { id: 'status',     label: 'สถานะค่างวด', sortable: true },
  { id: 'actions',    label: 'การจัดการ', sortable: false, align: 'right' as const },
];

export default function CustomerTable({
  customers = [],
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onLimitChange,
  sortBy = 'created_at',
  setSortBy,
  sortOrder = 'desc',
  setSortOrder,
  onRowClick,
  isLoading = false,
}: CustomerTableProps) {
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  // Custom status style mapping for Tailwind Badge
  const getBadgeClass = (status: string) => {
    if (status === 'overdue') return 'bg-red-50 text-red-500 border-red-100 hover:bg-red-50';
    if (status === 'active') return 'bg-emerald-50 text-emerald-500 border-emerald-100 hover:bg-emerald-50';
    if (status === 'completed') return 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100';
    return 'bg-blue-50 text-blue-500 border-blue-100 hover:bg-blue-50';
  };

  return (
    <div className="glass-card rounded-[24px] overflow-hidden bg-white shadow-[0_10px_30px_-10px_rgba(9,18,44,0.04)] border border-slate-200/80">
      
      {/* Loading Bar Indicator */}
      {isLoading && (
        <div className="h-0.5 w-full bg-blue-100 overflow-hidden">
          <div className="h-full bg-[#0051bb] animate-loading-bar" />
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b-2 border-slate-200/80">
            <TableRow>
              {HEAD_CELLS.map((cell) => (
                <TableHead
                  key={cell.id}
                  className={`text-[11px] font-extrabold uppercase tracking-wider text-slate-400 py-3 ${
                    cell.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {cell.sortable ? (
                    <button
                      onClick={() => handleSort(cell.id)}
                      className={`inline-flex items-center gap-1 transition-colors hover:text-[#0051bb] ${
                        sortBy === cell.id ? 'text-[#0051bb]' : ''
                      }`}
                    >
                      {cell.label}
                      <ArrowUpDown className="h-3 w-3 shrink-0" />
                    </button>
                  ) : (
                    <span>{cell.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.length === 0 ? (
              isLoading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-4 bg-slate-100 rounded w-16" /></TableCell>
                    <TableCell><div className="h-4 bg-slate-100 rounded w-28" /></TableCell>
                    <TableCell><div className="h-4 bg-slate-100 rounded w-20" /></TableCell>
                    <TableCell><div className="h-4 bg-slate-100 rounded w-24" /></TableCell>
                    <TableCell><div className="h-4 bg-slate-100 rounded w-14" /></TableCell>
                    <TableCell><div className="h-4 bg-slate-100 rounded w-10" /></TableCell>
                    <TableCell><div className="h-5 bg-slate-100 rounded-md w-16" /></TableCell>
                    <TableCell className="text-right"><div className="h-8 bg-slate-100 rounded-lg w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="h-8 w-8 text-slate-300 stroke-[1.5]" />
                      <span className="text-[12px] font-bold text-slate-400">
                        ไม่พบบัญชีสัญญาของลูกค้าตามเงื่อนไขการค้นหา
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            ) : (
              customers.map((c) => {
                const s = getCustomerStatus(c.status);
                const isOverdue = c.status === 'overdue';
                return (
                  <TableRow
                    key={c.id}
                    onClick={() => onRowClick?.(c.id)}
                    className={`cursor-pointer hover:bg-slate-50/70 transition-all duration-300 border-l-4 relative group ${
                      isOverdue 
                        ? 'border-l-red-500 bg-red-500/[0.015] hover:bg-red-500/[0.035] hover:shadow-[inset_0_0_0_1px_rgba(239,68,68,0.08)]' 
                        : 'border-l-transparent hover:border-l-[#0051bb] hover:bg-blue-500/[0.01] hover:shadow-[inset_0_0_0_1px_rgba(0,81,186,0.04)]'
                    }`}
                  >
                    <TableCell className="font-mono text-[11.5px] font-semibold text-slate-500 tracking-wide">
                      {formatContractId(c.id)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-bold text-slate-800 whitespace-nowrap">
                          {c.name}
                        </span>
                        {isOverdue && (
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div className="cursor-help text-red-500">
                                <Info className="h-4 w-4" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              บัญชีอยู่ระหว่างค้างชำระค่างวดสัญญา
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[11.5px] font-semibold text-slate-500">
                      {formatPhone(c.phone)}
                    </TableCell>
                    <TableCell className="text-[12.5px] font-bold text-slate-800">
                      {c.product}
                    </TableCell>
                    <TableCell className="text-[12.5px] font-semibold text-slate-500">
                      {c.branch}
                    </TableCell>
                    <TableCell className="text-[12.5px] font-bold text-slate-400 font-sans">
                      {c.plan_months}{' '}
                      <span className="text-[10px] font-semibold text-slate-400">เดือน</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`h-5 px-2 py-0 text-[9.5px] font-extrabold rounded-md ${getBadgeClass(c.status)}`}>
                        {s.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-0.5 text-[11.5px] font-extrabold text-[#0051bb] px-2.5 py-1.5 rounded-lg transition-all hover:bg-blue-50/70 hover:translate-x-0.5"
                      >
                        เปิดดูประวัติ
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80 bg-slate-50/40 p-4 px-6 gap-3 text-slate-600">
        <div className="text-[12px] font-semibold text-slate-500">
          แสดง {Math.min(total, (page - 1) * limit + 1)}–{Math.min(total, page * limit)} จากทั้งหมด{' '}
          <span className="font-extrabold text-slate-800">
            {total >= 10000 ? '10,000+' : total.toLocaleString()}
          </span>{' '}
          รายการ
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold">
            <span>แสดงรายการต่อหน้า:</span>
            <div className="w-[70px]">
              <Select
                value={String(limit)}
                onValueChange={(val) => onLimitChange?.(Number(val))}
              >
                <SelectTrigger className="h-8 rounded-lg border-slate-200 bg-white text-[12px] font-bold text-slate-700 px-2.5 py-1">
                  <SelectValue placeholder={String(limit)} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {[5, 10, 20, 50].map((opt) => (
                    <SelectItem key={opt} value={String(opt)} className="text-[12px] font-bold text-slate-700">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[11.5px] font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              ก่อนหน้า
            </button>
            <div className="text-[12px] font-bold px-2 text-slate-700">
              หน้า {page} / {totalPages}
            </div>
            <button
              onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-[11.5px] font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
