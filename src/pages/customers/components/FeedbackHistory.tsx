import { MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getSentiment, getFeedbackCategory } from '../../../utils/statusHelpers';
import { formatDate } from '../../../utils/formatters';

interface Feedback {
  id: string;
  rating: number;
  category: string;
  comment: string;
  sentiment: string;
  created_at: string;
}

interface FeedbackHistoryProps {
  feedbacks: Feedback[];
}

export default function FeedbackHistory({ feedbacks }: FeedbackHistoryProps) {
  const sorted = [...feedbacks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`h-3.5 w-3.5 ${i < rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-[20px] p-6 border border-slate-200/80 dark:border-white/5 shadow-[0_8px_30px_rgba(0,81,186,0.02)] dark:shadow-none text-left">
      
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5 text-left">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0051ba] dark:text-blue-400 shadow-sm dark:shadow-none">
          <MessageSquare className="h-4.5 w-4.5" />
        </div>
        <div>
          <span className="block text-[12.5px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100">
            ประวัติการบันทึกคำติชม (Feedback History)
          </span>
          <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            ข้อมูลประเมินและระดับความพึงพอใจการให้บริการ
          </span>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-600">
            <MessageSquare className="h-6 w-6 stroke-[1.5]" />
          </div>
          <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500">
            ยังไม่มีประวัติคำประเมินติชมจากลูกค้าคนนี้
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-0.5">
          {sorted.map((fb) => {
            const sent = getSentiment(fb.sentiment);
            return (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-slate-50/55 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.015)]"
                style={{ borderColor: sent.borderColor }}
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {renderStars(fb.rating)}
                    <Badge
                      variant="outline"
                      className="h-4.5 px-1.5 py-0 text-[8.5px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-[#0051ba] dark:text-blue-400 border-blue-100/60 dark:border-blue-900/40 rounded-md"
                    >
                      {getFeedbackCategory(fb.category)}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    {formatDate(fb.created_at, 'short')}
                  </span>
                </div>
                
                <p className="text-[12px] text-slate-700 dark:text-slate-300 font-bold leading-relaxed mb-3 text-left">
                  "{fb.comment}"
                </p>

                <div className="flex items-center gap-1.5">
                  <div
                    className="h-1.5 w-1.5 rounded-full shrink-0 shadow-[0_0_6px]"
                    style={{ backgroundColor: sent.color, boxShadow: `0 0 6px ${sent.color}` }}
                  />
                  <span
                    className="text-[9.5px] font-extrabold uppercase tracking-wide"
                    style={{ color: sent.color }}
                  >
                    Sentiment: {sent.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
