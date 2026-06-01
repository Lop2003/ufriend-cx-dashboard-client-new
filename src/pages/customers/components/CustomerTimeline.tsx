import { useState } from 'react';
import { ClipboardList, Check, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '../../../components/Toast';
import { updateFollowUpStatus } from '../../../services/followUpMutations';
import { getFollowUpType } from '../../../utils/statusHelpers';
import { formatDate } from '../../../utils/formatters';

interface FollowUp {
  id: string;
  type: string;
  status: string;
  created_at: string;
  note: string;
}

interface CustomerTimelineProps {
  followUps: FollowUp[];
  customerId: string;
  onRefresh?: () => Promise<void> | void;
}

export default function CustomerTimeline({ followUps = [], onRefresh }: CustomerTimelineProps) {
  const { showToast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleComplete = async (followUpId: string) => {
    setUpdatingId(followUpId);
    try {
      await updateFollowUpStatus(followUpId, 'done');
      showToast('success', 'บันทึกการติดตามดำเนินการเรียบร้อยแล้ว');
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Failed to update follow up:', err);
      showToast('error', 'ไม่สามารถปรับปรุงสถานะการติดตามได้');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="glass-card rounded-[20px] p-6 border border-border bg-card text-card-foreground shadow-[0_8px_30px_rgba(0,0,0,0.15)] text-left">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-border text-left">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 shadow-sm">
          <ClipboardList className="h-4.5 w-4.5" />
        </div>
        <div>
          <span className="block text-[12.5px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100">
            บันทึกการติดตามความคืบหน้า (Timeline)
          </span>
          <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            ประวัติการประสานงานและแนวทางการดูแลผู้บริโภค
          </span>
        </div>
      </div>

      {/* Logs timeline list */}
      {followUps.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground/60">
            <Clock className="h-6 w-6 stroke-[1.5]" />
          </div>
          <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500">
            ยังไม่มีประวัติการโทรหรือติดตามลูกค้ารายนี้
          </span>
        </div>
      ) : (
        <div className="relative pl-1 max-h-[360px] overflow-y-auto pr-0.5 space-y-5">
          {[...followUps]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((fu, idx, arr) => {
              const typeInfo = getFollowUpType(fu.type);
              const isDone = fu.status === 'done';
              const isPending = fu.status === 'pending';

              return (
                <div key={fu.id} className="relative pl-7 pb-2 text-left">
                  
                  {/* Vertical timeline track line */}
                  {idx < arr.length - 1 && (
                    <div
                      className={`absolute left-[7px] top-[22px] bottom-[-22px] w-[2px] z-0 ${
                        isDone 
                        ? 'bg-gradient-to-b from-emerald-500 to-border' 
                        : 'bg-border'
                    }`}
                  />
                )}

                {/* Interactive timeline node dot */}
                <div
                  className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center z-10 transition-all duration-200`}
                  style={{ 
                    backgroundColor: isDone ? '#10B981' : typeInfo.color,
                    boxShadow: isDone 
                      ? '0 0 0 3px rgba(16, 185, 129, 0.15), 0 2px 4px rgba(0,0,0,0.1)' 
                      : `0 0 0 3px ${typeInfo.color}15, 0 2px 4px rgba(0,0,0,0.1)`
                  }}
                >
                  {isDone ? (
                    <Check className="h-2 w-2 text-white stroke-[3.5]" />
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-white" />
                  )}
                </div>

                {/* Detail card */}
                <div className="glass-card rounded-2xl p-4 border border-border bg-card shadow-[0_4px_15px_rgba(0,0,0,0.15)] transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/40 hover:translate-y-[-1px]">
                  
                  {/* Top: Date and Type Badge */}
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className="h-5 px-2 py-0 text-[9px] font-extrabold rounded-md"
                      style={{
                        backgroundColor: `${typeInfo.color}10`,
                        color: typeInfo.color,
                        borderColor: `${typeInfo.color}25`
                      }}
                    >
                      {typeInfo.label}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-sans">
                      {formatDate(fu.created_at)}
                    </span>
                  </div>

                  {/* Log description card */}
                  <p className="text-[12px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-muted/20 border border-border p-3 rounded-xl mb-4 text-left">
                    {fu.note}
                  </p>

                  {/* Actions & Author Footer */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
                    <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-550">
                      ผู้บันทึก: ฝ่ายลูกค้าสัมพันธ์ uFriend
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Done update action button */}
                      {isPending && (
                        <button
                          type="button"
                          disabled={updatingId === fu.id}
                          onClick={() => handleComplete(fu.id)}
                          className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-[#0051bb] dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 bg-card text-foreground px-2 py-1 rounded-md transition-all hover:bg-[#0051bb] dark:hover:bg-blue-600 hover:text-white hover:border-transparent disabled:opacity-50 cursor-pointer"
                        >
                          {updatingId === fu.id ? (
                            <Loader2 className="h-2.5 w-2.5 animate-spin" />
                          ) : (
                            <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                          )}
                          เสร็จสิ้นงาน
                        </button>
                      )}

                      {/* Status chip */}
                      <Badge
                        variant="outline"
                        className={`h-5 px-2 py-0 text-[9px] font-extrabold rounded-md flex items-center gap-1 ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 border-emerald-100/70 dark:border-emerald-900/50 hover:bg-emerald-50'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 border-rose-100/70 dark:border-rose-900/50 hover:bg-rose-50'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="h-2.5 w-2.5" />}
                        {isDone ? 'สำเร็จเรียบร้อย' : 'อยู่ระหว่างดำเนินการ'}
                      </Badge>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
