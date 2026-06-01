import { Loader2, MessageSquare, ClipboardList, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { useCustomerDetail } from '../../../hooks/useCustomerDetail';
import { PATHS } from '../../../routes/paths';
import CustomerTimeline from './CustomerTimeline';
import CustomerInfoCard from './CustomerInfoCard';
import FeedbackHistory from './FeedbackHistory';

interface CustomerDetailModalProps {
  selectedCustomerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerDetailModal({ selectedCustomerId, isOpen, onClose }: CustomerDetailModalProps) {
  const navigate = useNavigate();
  const { customer, isLoading: detailLoading, refetch: loadDetail } = useCustomerDetail(selectedCustomerId);

  const handleAddFeedback = () => {
    if (!selectedCustomerId) return;
    navigate(`${PATHS.ADD_FEEDBACK}?customerId=${selectedCustomerId}`, {
      state: { customerId: selectedCustomerId },
    });
  };

  const handleAddFollowUp = () => {
    if (!selectedCustomerId) return;
    navigate(`${PATHS.FOLLOW_UP}?customerId=${selectedCustomerId}`, {
      state: { customerId: selectedCustomerId },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-[92vw] lg:max-w-6xl rounded-3xl p-0 gap-0 overflow-hidden border border-slate-200 dark:border-white/8 shadow-2xl bg-[#F3F7FC] dark:bg-[#0c1022] max-h-[92vh] flex flex-col">

        {/* Dialog Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2 py-0.5 bg-indigo-50/50 dark:bg-indigo-950/40 text-[10px] uppercase font-extrabold tracking-wide text-[#0051bb] dark:text-blue-400 border border-indigo-100/50 dark:border-indigo-900/40 rounded-md">
              Customer Detail
            </Badge>
            <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
            <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
              ประวัติการประสานงานและดูแลลูกค้าเชิงลึก
            </span>
          </DialogTitle>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white hover:scale-105"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* Scrollable Dialog Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-3.5 space-y-5">
          {detailLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#0051bb] dark:text-blue-400" />
              <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                กำลังเชื่อมต่อและประมวลผลข้อมูลบัญชีผู้ใช้เชิงลึกจาก Server...
              </span>
            </div>
          ) : !customer ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <AlertTriangle className="h-8 w-8 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
              <span className="text-[13px] font-bold text-slate-400 dark:text-slate-500">
                ขออภัย ไม่พบเอกสารสัญญารายการลูกค้านี้ในระบบ
              </span>
            </div>
          ) : (
            <>
              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleAddFeedback}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#ffdb1b] dark:bg-yellow-500/90 text-slate-800 dark:text-slate-900 text-[12px] font-extrabold px-4 py-2 shadow-sm transition-all hover:bg-[#e0bd10] dark:hover:bg-yellow-400 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageSquare className="h-4 w-4" />
                  บันทึกการส่งคำติชม
                </button>

                <button
                  type="button"
                  onClick={handleAddFollowUp}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0051bb] dark:bg-blue-600 text-white text-[12px] font-extrabold px-4 py-2 shadow-sm transition-all hover:bg-[#00348c] dark:hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ClipboardList className="h-4 w-4" />
                  บันทึกการติดตามลูกค้า
                </button>
              </div>

              {/* Data Cards Layer */}
              <div className="space-y-6">
                {/* Customer Info Card */}
                <CustomerInfoCard customer={customer} />

                {/* Feedback & Timeline Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <FeedbackHistory feedbacks={customer?.feedbacks ?? []} />
                  <CustomerTimeline
                    followUps={customer?.follow_ups ?? []}
                    customerId={selectedCustomerId}
                    onRefresh={() => { loadDetail(); }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
