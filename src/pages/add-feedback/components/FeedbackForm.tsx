import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Check, AlertCircle, Loader2 } from 'lucide-react';
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

interface FeedbackFormProps {
  customers: Customer[];
  customerId: string;
  setCustomerId: (id: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  hoverRating: number;
  setHoverRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  category: string;
  setCategory: (category: string) => void;
  error: string;
  setError: (error: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  selectedCust: Customer | null;
  onSearchChange: (query: string) => void;
  searchLoading: boolean;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: 'service', label: 'ด้านการบริการของพนักงานสาขา/ฝ่ายขาย' },
  { value: 'payment', label: 'ด้านช่องทางการจ่ายค่างวดและกระบวนการทวงถาม' },
  { value: 'product', label: 'ด้านอุปกรณ์/สินค้าและสัญญา (iPhone, iPad)' },
  { value: 'branch', label: 'ด้านสถานที่และการเดินทางอำนวยความสะดวกในสาขา' },
];

export default function FeedbackForm({
  customers,
  customerId,
  setCustomerId,
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  comment,
  setComment,
  category,
  setCategory,
  error,
  setError,
  isSubmitting,
  handleSubmit,
  selectedCust,
  onSearchChange,
  searchLoading,
  onCancel,
}: FeedbackFormProps) {
  const displayRating = hoverRating !== -1 ? hoverRating : rating;

  const renderStarSelector = () => {
    return (
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const starVal = i + 1;
          const isFilled = starVal <= displayRating;
          return (
            <motion.button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(starVal)}
              onMouseLeave={() => setHoverRating(-1)}
              onClick={() => setRating(starVal)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="focus:outline-none"
            >
              <Star
                className={`h-9 w-9 transition-colors ${
                  isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700'
                }`}
              />
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center py-2 text-left">
      
      {/* Back button */}
      <div className="w-full max-w-[1400px] mb-5 flex">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0051bb] dark:text-blue-400 text-[12px] font-extrabold px-4 py-2 transition-all hover:bg-blue-100/80 dark:hover:bg-blue-900/40 hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปหน้ารายชื่อลูกค้า
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-[1400px] rounded-3xl p-6 md:p-8 space-y-6 border border-slate-200/60 dark:border-white/5 shadow-[0_10px_30px_-10px_rgba(0,81,186,0.05)] dark:shadow-none text-left"
      >
        {/* Header */}
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0051bb] dark:text-blue-400 shadow-sm dark:shadow-none">
            <Star className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-[14px] font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              กรอกรายละเอียดบันทึกข้อมูลคำติชมลูกค้า (CSAT)
            </span>
            <span className="block text-[11.5px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              กรุณาระบุคะแนนระดับความสุขและการวิจารณ์ลงระบบข้อมูลความพึงพอใจของแบรนด์ uFriend
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex gap-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-4 text-red-800 dark:text-red-300">
            <div className="shrink-0 text-red-500 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="text-[12.5px] font-bold text-red-700 dark:text-red-400 leading-tight">
              {error}
            </span>
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
          label="เลือกลูกค้าตามสัญญารายการ (พิมพ์ค้นหารายชื่อได้) *"
        />

        {/* Rating Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            ให้คะแนนระดับความพึงพอใจการใช้บริการ (1 - 5 ดาว) *
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50/55 dark:bg-white/[0.02] p-4 w-full">
            {renderStarSelector()}
            <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 leading-none">
              ({displayRating} เต็ม 5.0 คะแนน /{' '}
              {rating >= 4 ? 'พอใจมาก' : rating <= 2 ? 'ควรปรับปรุง' : 'ปานกลาง'})
            </span>
          </div>
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            หมวดหมู่หัวข้อที่มีความประสงค์จะติชมแจ้งร้องเรียน *
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 rounded-xl border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 text-[12px] font-bold text-slate-700 dark:text-slate-300">
              <SelectValue placeholder="เลือกหมวดหมู่การบริการ" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200/80 dark:border-white/10">
              {CATEGORIES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-2">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            รายละเอียดคำวิจารณ์เชิงลึกหรือข้อเสนอแนะเพิ่มเติมสำหรับบริการ *
          </label>
          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError('');
            }}
            placeholder="ตัวอย่างเช่น: พนักงานหน้าสาขาบริการดี สุภาพ รวดเร็วมาก หรือ ต้องการให้ปรับปรุงระยะเวลาดำเนินการอนุมัติเอกสาร..."
            rows={6}
            className="flex w-full rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4 text-[12px] font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition-all focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-5 border-t border-slate-200/80 dark:border-white/5">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-[12.5px] font-bold text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-white/10"
          >
            ยกเลิกรายการ
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-5 inline-flex items-center gap-1.5 rounded-xl bg-[#0051bb] dark:bg-blue-600 text-white text-[12.5px] font-extrabold shadow-sm transition-all hover:bg-[#00348c] dark:hover:bg-blue-500 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4 stroke-[2.5]" />
            )}
            {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกประวัติคำติชม'}
          </button>
        </div>

      </form>
    </div>
  );
}
