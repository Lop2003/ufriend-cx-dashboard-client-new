import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Sidebar from './Sidebar';
import { PATHS } from '../routes/paths';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AuthUser } from '@/services/authService';

interface MainLayoutProps {
  children: React.ReactNode;
  user: AuthUser | null;
  onLogout: () => void;
}

const PAGE_LABELS: Record<string, { breadcrumb: string | null; label: string }> = {
  [PATHS.DASHBOARD]:    { breadcrumb: null,             label: 'dashboard' },
  [PATHS.CUSTOMERS]:    { breadcrumb: 'รายชื่อลูกค้า', label: 'customers' },
  [PATHS.ADD_FEEDBACK]: { breadcrumb: 'บันทึกคำติชม',  label: 'add-feedback' },
  [PATHS.FOLLOW_UP]:    { breadcrumb: 'บันทึกการติดตาม', label: 'add-followup' },
};

export default function MainLayout({ children, user, onLogout }: MainLayoutProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageInfo = PAGE_LABELS[location.pathname] ?? PAGE_LABELS[PATHS.DASHBOARD];

  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* Saturated Neon Accent Orbs (Floating Ambient Glows) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.2, 0.12],
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -left-[5%] -top-[10%] h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[80px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.16, 0.1],
          x: [0, -30, 40, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -right-[5%] -bottom-[5%] h-[450px] w-[450px] rounded-full bg-yellow-500/12 blur-[90px] pointer-events-none z-0"
      />

      {/* ── Desktop Sidebar Container ─────────────────────────────── */}
      <div
        className={`hidden md:flex h-full shrink-0 flex-col pt-4 pb-4 pl-4 pr-2 z-10 transition-all duration-300 ease-in-out`}
        style={{ width: isCollapsed ? 68 + 16 : 240 + 16 }}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          isMobileOpen={false}
          user={user}
          onLogout={onLogout}
        />
      </div>

      {/* ── Mobile Sidebar Drawer (AnimatePresence) ───────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Slide-out Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[240px] bg-transparent z-50 md:hidden flex flex-col"
            >
              <Sidebar
                isCollapsed={false}
                onToggleCollapse={() => {}}
                isMobileOpen={true}
                onCloseMobile={() => setMobileOpen(false)}
                user={user}
                onLogout={onLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Container ───────────────────────────────── */}
      <div className="relative flex flex-1 flex-col overflow-hidden p-0 md:pt-4 md:pb-4 md:pr-4 md:pl-2 z-10">
        <div className="flex flex-1 flex-col overflow-hidden bg-white/95 md:rounded-[24px] border border-slate-200/80 shadow-2xl md:shadow-[0_20px_40px_-15px_rgba(9,18,44,0.04)]">
          
          {/* Header */}
          <header className="flex h-14 items-center border-b border-slate-200/80 bg-white px-4 md:px-8 shrink-0">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 mr-3"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mr-auto">
              <Badge variant="secondary" className="px-2.5 py-0.5 bg-blue-50 text-[10px] uppercase font-extrabold tracking-wider text-[#0051bb] border border-blue-100 rounded-md">
                {pageInfo.label}
              </Badge>
              {pageInfo.breadcrumb && (
                <>
                  <span className="text-slate-300 font-normal">/</span>
                  <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">
                    {pageInfo.breadcrumb}
                  </span>
                </>
              )}
            </div>

            {/* Right User Profiling */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[11.5px] font-extrabold text-slate-800 leading-tight">
                  {user?.name || "เจ้าหน้าที่บริการลูกค้า uFriend"}
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  {user?.email || "ฝ่ายบริหารประสบการณ์ลูกค้า"}
                </span>
              </div>
              
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="group relative cursor-pointer">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-[0_4px_10px_rgba(0,81,186,0.15)] ring-2 ring-transparent transition-all group-hover:scale-105 group-hover:ring-blue-100">
                      {user?.avatarUrl && (
                        <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                      )}
                      <AvatarFallback className="bg-[#0051bb] text-white">
                        <UserIcon className="h-4.5 w-4.5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  {user?.name || "โปรไฟล์ผู้ใช้"}
                </TooltipContent>
              </Tooltip>
            </div>
          </header>

          {/* Scrollable page area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
            <div className="page-transition min-h-full">
              {children}
            </div>
          </main>
          
        </div>
      </div>
    </div>
  </SidebarProvider>
);
}
