import { Tag, Smartphone, Phone, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCustomerStatus } from '../../../utils/statusHelpers';
import { formatDate, formatContractId, formatPhone } from '../../../utils/formatters';

interface Customer {
  id: string;
  name: string;
  phone: string;
  product: string;
  branch: string;
  plan_months: number;
  status: string;
  created_at: string;
}

interface CustomerInfoCardProps {
  customer: Customer;
}

export default function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  const s = getCustomerStatus(customer.status);
  const isOverdue = customer.status === 'overdue';

  const getBadgeClass = (status: string) => {
    if (status === 'overdue') return 'bg-red-50 text-red-500 border-red-100 hover:bg-red-50';
    if (status === 'active') return 'bg-emerald-50 text-emerald-500 border-emerald-100 hover:bg-emerald-50';
    if (status === 'completed') return 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100';
    return 'bg-blue-50 text-blue-500 border-blue-100 hover:bg-blue-50';
  };

  const infoItems = [
    { icon: Tag, label: 'รหัสอ้างอิงสัญญา', value: formatContractId(customer.id), isCode: true },
    { icon: Smartphone, label: 'สินค้าผ่อนชำระ', value: customer.product },
    { icon: Phone, label: 'เบอร์ติดต่อลูกค้า', value: formatPhone(customer.phone), isCode: true },
    { icon: MapPin, label: 'สาขาที่ทำรายการ', value: `สาขา ${customer.branch}` },
    { icon: Clock, label: 'ระยะสัญญาทั้งหมด', value: `${customer.plan_months} เดือน` },
    { icon: Calendar, label: 'วันที่เริ่มทำสัญญา', value: formatDate(customer.created_at, 'long') },
  ];

  return (
    <div className="glass-card rounded-[20px] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,81,186,0.02)] text-left">
      <div className="flex flex-wrap justify-between items-center gap-4 pb-5 border-b border-slate-200/80 mb-5">
        <div>
          <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
            ข้อมูลบัญชีผู้ผ่อนชำระ
          </span>
          <span className="text-[20px] font-extrabold text-slate-800 tracking-tight mt-0.5">
            {customer.name}
          </span>
        </div>
        <Badge variant="outline" className={`h-6 px-2.5 py-0 text-[10px] font-extrabold rounded-md ${getBadgeClass(customer.status)}`}>
          {s.label}
        </Badge>
      </div>

      {isOverdue && (
        <div className="mb-5 flex gap-3.5 rounded-xl border border-red-200 bg-red-50/50 p-4 text-red-800">
          <div className="shrink-0 text-red-500">
            <AlertTriangle className="h-5 w-5 stroke-[2]" />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="text-[12.5px] font-extrabold leading-tight">
              ระบบตรวจพบบัญชีมียอดค้างชำระ (Payment Overdue Case)
            </h4>
            <p className="text-[11.5px] font-medium leading-relaxed text-red-700">
              สัญญานี้มีจำนวนค้างชำระสะสม กรุณาดำเนินการโทรติดต่อประสานงาน แจ้งสิทธิพิเศษ หรือเจรจาประนอมหนี้ เพื่อช่วยแนะนำการจ่ายชำระโดยด่วนที่สุด
            </p>
          </div>
        </div>
      )}

      {/* Info Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {infoItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 rounded-xl border border-slate-200/60 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50 hover:border-blue-100/80"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
                  {item.label}
                </span>
                <span className={`text-[12px] font-bold text-slate-800 mt-0.5 ${
                  item.isCode ? 'font-mono tracking-wide' : ''
                }`}>
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
