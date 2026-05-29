import { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Customer {
  id: string;
  name: string;
  phone: string;
  product: string;
  branch: string;
  status: string;
}

interface SearchableCustomerDropdownProps {
  customers: Customer[];
  selectedCustomerId?: string;
  selectedCustomerDetail?: Customer | null;
  onChange: (id: string) => void;
  onSearchChange?: (val: string) => void;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  showOverdueBadges?: boolean;
}

export default function SearchableCustomerDropdown({
  customers = [],
  selectedCustomerId = '',
  selectedCustomerDetail = null,
  onChange,
  onSearchChange,
  isLoading = false,
  label = 'เลือกบัญชีลูกค้าสัญญา',
  placeholder = 'พิมพ์เพื่อค้นหาชื่อลูกค้า, เบอร์โทร, สาขา หรือสินค้า...',
  showOverdueBadges = false,
}: SearchableCustomerDropdownProps) {
  const selectedCustomer = selectedCustomerDetail || customers.find(c => c.id === selectedCustomerId) || null;
  const [isOpen, setIsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure selected customer is displayed if search result doesn't contain them
  const finalOptions = [...customers];
  if (selectedCustomer && !customers.some(c => c.id === selectedCustomer.id)) {
    finalOptions.unshift(selectedCustomer);
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (customer: Customer) => {
    onChange(customer.id);
    setIsOpen(false);
    setSearchVal('');
  };

  const displayInputValue = selectedCustomer
    ? `${selectedCustomer.name} (${selectedCustomer.product} / สาขา${selectedCustomer.branch})`
    : searchVal;

  return (
    <div className="relative w-full text-left" ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          value={isOpen ? searchVal : displayInputValue}
          placeholder={selectedCustomer ? '' : placeholder}
          onFocus={() => {
            setIsOpen(true);
            setSearchVal('');
          }}
          onChange={(e) => {
            const val = e.target.value;
            setSearchVal(val);
            onSearchChange?.(val);
          }}
          className="pl-10 pr-10 h-10 w-full rounded-xl text-[12.5px] font-semibold border-slate-200/80 bg-white/70 backdrop-blur-sm transition-all focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-[260px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(9,18,44,0.12)] backdrop-blur-md">
          {finalOptions.length === 0 ? (
            <div className="px-4 py-3 text-center text-xs font-semibold text-slate-400">
              {isLoading ? 'กำลังโหลดข้อมูล...' : 'ไม่พบข้อมูลบัญชีลูกค้า'}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {finalOptions.map((option) => {
                const isSelected = option.id === selectedCustomerId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-left rounded-xl transition-all duration-150 ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-[3.5px] border-[#0051ba] text-slate-900 font-bold pl-3'
                        : 'hover:bg-slate-50 border-l-[3.5px] border-transparent text-slate-700'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-bold text-slate-800">
                          {option.name}
                        </span>
                        {showOverdueBadges && option.status === 'overdue' && (
                          <Badge variant="destructive" className="h-4.5 px-1.5 py-0 text-[9px] font-extrabold rounded-md">
                            ค้างชำระค่างวด
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5 font-mono">
                        เบอร์โทรศัพท์: {option.phone}
                      </span>
                    </div>

                    <div className="flex gap-1.5 items-center shrink-0 ml-2">
                      <Badge variant="secondary" className="h-4.5 px-1.5 py-0 text-[9.5px] font-extrabold bg-slate-100 text-slate-700 rounded-md">
                        {option.product}
                      </Badge>
                      <Badge variant="outline" className="h-4.5 px-1.5 py-0 text-[9.5px] font-extrabold bg-blue-50/50 text-[#0051ba] border-blue-100/80 rounded-md">
                        สาขา {option.branch}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
