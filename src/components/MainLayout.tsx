import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { PATHS } from '../routes/paths';
import { SidebarProvider } from '@/components/animate-ui/components/radix/sidebar';
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
      <div className="relative flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0a0e1a] text-slate-900 dark:text-slate-100">

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
        className="absolute -left-[5%] -top-[10%] h-[450px] w-[450px] rounded-full bg-blue-600/15 dark:bg-blue-500/8 blur-[80px] pointer-events-none z-0"
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
        className="absolute -right-[5%] -bottom-[5%] h-[450px] w-[450px] rounded-full bg-yellow-500/12 dark:bg-yellow-500/5 blur-[90px] pointer-events-none z-0"
      />

      {/* ── Desktop Sidebar Container ─────────────────────────────── */}
      <div
        className={`hidden md:flex h-full shrink-0 flex-col pt-0 pb-0 pl-0 pr-0 z-10 transition-all duration-300 ease-in-out`}
        style={{ width: isCollapsed ? 68 : 240 }}
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
      <div className="relative flex flex-1 flex-col overflow-hidden p-0 z-10">
        <div className="flex flex-1 flex-col overflow-hidden bg-white/95 dark:bg-white/[0.02] md:rounded-none border-l border-slate-200/80 dark:border-white/5">
          
          {/* Header */}
          <header className="flex h-14 items-center border-b border-slate-200/80 dark:border-white/5 bg-white dark:bg-transparent px-4 md:px-8 shrink-0">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 mr-3"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mr-auto">
              <Badge variant="secondary" className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-[10px] uppercase font-extrabold tracking-wider text-[#0051bb] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 rounded-md">
                {pageInfo.label}
              </Badge>
              {pageInfo.breadcrumb && (
                <>
                  <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
                  <span className="text-[11.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {pageInfo.breadcrumb}
                  </span>
                </>
              )}
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle />

          </header>

          {/* Scrollable page area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-transparent">
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
