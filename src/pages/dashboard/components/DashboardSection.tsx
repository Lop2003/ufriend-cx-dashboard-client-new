import React from 'react';

interface DashboardSectionProps {
  icon?: React.ReactNode;
  label: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardSection({ icon, label, children, rightSlot }: DashboardSectionProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}
