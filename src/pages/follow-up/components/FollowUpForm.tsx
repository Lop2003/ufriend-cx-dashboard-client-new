import React from 'react';
import { ArrowLeft, Clock, Bell, Check, AlertCircle, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchableCustomerDropdown from '../../../components/SearchableCustomerDropdown';

interface Customer {
  id: string;
  name: string;
  phone: string;
  product: string;
  branch: string;
  status: string;
}

interface FollowUpFormProps {
  customers: Customer[];
  customerId: string;
  setCustomerId: (id: string) => void;
  type: string;
  setType: (type: string) => void;
  note: string;
  setNote: (note: string) => void;
  error: string;
  setError: (error: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  selectedCust: Customer | null;
  onSearchChange: (query: string) => void;
  searchLoading: boolean;
  onCancel: () => void;
}

const FOLLOW_UP_TYPES = [
  { value: 'payment_remind', label: 'โทรแจ้งเตือนการค้างชำระเงิน (Payment Remind)' },
  { value: 'feedback_reply', label: 'โทรขอโทษและชี้แจงคำติชมความพึงพอใจ (Feedback Reply)' },
  { value: 'promotion', label: 'โทรแจ้งเสนอโปรโมชั่นพิเศษ (Promotion)' },
];

export default function FollowUpForm({
  customers,
  customerId,
  setCustomerId,
  type,
  setType,
  note,
  setNote,
  error,
  setError,
  isSubmitting,
  handleSubmit,
  selectedCust,
  onSearchChange,
  searchLoading,
  onCancel,
}: FollowUpFormProps) {
  return (
    <div className="w-full flex flex-col items-center py-2 text-left">
      
      {/* Back button */}
      <div className="w-full max-w-[1400px] mb-5 flex">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-[#0051bb] text-[12px] font-extrabold px-4 py-2 transition-all hover:bg-blue-100/80 hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปหน้ารายชื่อลูกค้า
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-[1400px] rounded-3xl p-6 md:p-8 space-y-6 border border-slate-200/60 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] text-left"
      >
        {/* Header */}
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#0051bb] shadow-sm">
            <Clock className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-[14px] font-extrabold text-slate-800 tracking-tight">
              บันทึกประวัติการโทรติดตามลูกค้า (Follow-Up)
            </span>
            <span className="block text-[11.5px] font-semibold text-slate-400 mt-0.5">
              บันทึกผลการสื่อสารโทรประสานงานแจ้งค่างวด เจรจาหนี้สิน หรือชี้แจงแก้ไขปัญหาความพึงพอใจลูกค้า
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50/50 p-4 text-red-800">
            <div className="shrink-0 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="text-[12.5px] font-bold text-red-700 leading-tight">
              {error}
            </span>
          </div>
        )}

        {/* Overdue Caution Alert */}
        {selectedCust?.status === 'overdue' && (
          <div className="flex gap-3.5 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-amber-800">
            <div className="shrink-0 text-amber-500">
              <Bell className="h-5 w-5 stroke-[2] animate-bounce" />
            </div>
            <div className="space-y-1 text-left text-[12px] font-medium leading-relaxed text-amber-700">
              <strong>ข้อควรระวัง:</strong> บัญชีผู้ใช้นี้อยู่ระหว่างค้างชำระค่างวด (Overdue Case) แนะนำให้ใช้หัวข้อการโทรติดตาม "โทรแจ้งเตือนค้างชำระเงิน"
            </div>
          </div>
        )}

        {/* Customer Select Dropdown */}
        <SearchableCustomerDropdown
          customers={customers}
          selectedCustomerId={customerId}
          selectedCustomerDetail={selectedCust}
          onChange={(id) => {
            setCustomerId(id);
            setError('');
          }}
          onSearchChange={onSearchChange}
          isLoading={searchLoading}
          label="เลือกบัญชีคู่สัญญาลูกค้า (พิมพ์ค้นหารายชื่อได้) *"
          showOverdueBadges
        />

        {/* Type Select */}
        <div className="space-y-2">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            ประเภทหัวข้อกิจกรรมโทรติดตามดูแล *
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-11 rounded-xl border-slate-200/80 bg-white/70 text-[12px] font-bold text-slate-700">
              <SelectValue placeholder="เลือกประเภทกิจกรรมติดตาม" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200/80">
              {FOLLOW_UP_TYPES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-[12px] font-semibold text-slate-700">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Note Textarea */}
        <div className="space-y-2">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            รายละเอียดผลลัพธ์การเจรจาหรือบันทึกข้อประสานงานติดตาม *
          </label>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setError('');
            }}
            placeholder="ตัวอย่างเช่น: โทรติดต่อแจ้งยอดค้างชำระเรียบร้อยแล้ว ลูกค้าขอผ่อนผันจ่ายวันศุกร์นี้ผ่านช่องทาง Mobile Banking หน้าแอปพลิเคชันหลัก..."
            rows={6}
            className="flex w-full rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-[12px] font-semibold text-slate-800 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-5 border-t border-slate-200/80">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-5 rounded-xl border border-slate-200 bg-white text-[12.5px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            ยกเลิกรายการ
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-5 inline-flex items-center gap-1.5 rounded-xl bg-[#0051bb] text-white text-[12.5px] font-extrabold shadow-sm transition-all hover:bg-[#00348c] hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4 stroke-[2.5]" />
            )}
            {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการติดตาม'}
          </button>
        </div>

      </form>
    </div>
  );
}
