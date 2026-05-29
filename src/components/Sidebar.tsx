import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Clock,
  ChevronLeft,
  X,
  User,
  LogOut
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { PATHS } from '../routes/paths';
import brandIcon from '../assets/Icon.png';
import type { AuthUser } from '@/services/authService';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile?: () => void;
  user: AuthUser | null;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { label: 'แดชบอร์ด', path: PATHS.DASHBOARD, icon: LayoutDashboard },
  { label: 'รายชื่อลูกค้า', path: PATHS.CUSTOMERS, icon: Users },
  { label: 'บันทึกคำติชม', path: PATHS.ADD_FEEDBACK, icon: MessageSquare },
  { label: 'บันทึกการติดตาม', path: PATHS.FOLLOW_UP, icon: Clock },
];

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile, user, onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const handleNav = (path: string) => {
    navigate(path);
    onCloseMobile?.();
  };

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-[#002D8B]/95 via-[#0038A5]/90 to-[#002D8B]/95 backdrop-blur-2xl text-slate-200 transition-all duration-300 ease-in-out ${isMobileOpen ? 'rounded-none' : 'rounded-[24px]'
        } border border-white/10 shadow-2xl`}
    >
      {/* Saturated Cosmic background glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-blue-500/20 blur-[30px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-[20%] -right-10 h-32 w-32 rounded-full bg-yellow-400/15 blur-[25px] pointer-events-none"
      />

      {/* Header section */}
      <div className="relative z-10">
        <div
          className={`flex h-[68px] items-center border-b border-white/10 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'
            }`}
        >
          {/* Logo & Branding */}
          <motion.div
            layout="position"
            className="flex items-center gap-3 overflow-hidden"
          >
            <motion.div
              whileHover={{ rotate: -5, scale: 1.05 }}
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border border-white/20 bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.15)] transition-all"
            >
              <img
                src={brandIcon}
                alt="uFriend"
                className="h-[22px] w-[22px] object-contain drop-shadow-[0px_2px_4px_rgba(0,0,0,0.15)]"
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col overflow-hidden text-left"
                >
                  <span className="text-[14px] font-extrabold leading-none text-white tracking-wide">
                    <span className="text-[#ffdb1b]">U</span>friend CX
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-300/70">
                    แผงควบคุมหลัก
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex items-center gap-1">
            {/* Desktop Toggle Button */}
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleCollapse}
                  className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/15 hover:text-white"
                >
                  <ChevronLeft
                    className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''
                      }`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isCollapsed ? 'ขยายแถบเมนู' : 'พับแถบเมนู'}
              </TooltipContent>
            </Tooltip>

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                className="flex md:hidden h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation items using Shadcn UI Sidebar components */}
        <nav className="px-3 py-4">
          <SidebarMenu
            className="space-y-1.5"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <SidebarMenuItem
                  key={item.path}
                  onMouseEnter={() => setHoveredPath(item.path)}
                >
                  <Tooltip delayDuration={300} disableHoverableContent={!isCollapsed}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`group relative flex w-full items-center rounded-xl py-2.5 transition-all duration-200 overflow-hidden ${isCollapsed ? 'justify-center px-0' : 'px-4'
                          } ${isActive
                            ? 'text-white'
                            : 'text-slate-300 hover:text-white'
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleNav(item.path)}
                          className="relative w-full h-full flex items-center bg-transparent border-none p-0 outline-none cursor-pointer"
                        >
                          {/* Active Glass backdrop pill (Animate UI Style) */}
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active-backdrop"
                              className="absolute inset-0 z-0 rounded-xl bg-white/10 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                              transition={{
                                type: 'spring',
                                stiffness: 380,
                                damping: 30,
                              }}
                            />
                          )}

                          {/* Hover backdrop tracking pill (Animate UI Style) */}
                          {hoveredPath === item.path && !isActive && (
                            <motion.div
                              layoutId="sidebar-hover-backdrop"
                              className="absolute inset-0 z-0 rounded-xl bg-white/5 border border-white/5"
                              transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 28,
                              }}
                            />
                          )}

                          {/* Active yellow bar indicator */}
                          {isActive && !isCollapsed && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-2.5 top-[30%] h-[40%] w-[3px] rounded-full bg-[#ffdb1b] shadow-[0_0_10px_#ffdb1b,0_0_20px_rgba(255,219,27,0.5)]"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}

                          {/* Content Container (z-10 to stay above backdrop pills) */}
                          <div className={`relative z-10 flex items-center w-full ${isCollapsed ? 'justify-center' : ''}`}>
                            <div
                              className={`flex items-center justify-center shrink-0 ${isCollapsed ? 'w-auto' : 'mr-3'
                                } ${isActive ? 'text-[#ffdb1b]' : 'text-slate-300 group-hover:text-white'}`}
                            >
                              <Icon className="h-4.5 w-4.5 transition-colors" />
                            </div>

                            {!isCollapsed && (
                              <span className={`text-[12.5px] font-medium tracking-wide text-left transition-all ${isActive ? 'font-bold' : ''
                                }`}>
                                {item.label}
                              </span>
                            )}
                          </div>
                        </button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </nav>
      </div>

      {/* Footer / User Profile section */}
      <div className="relative z-10 border-t border-white/5 bg-slate-950/40 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <motion.div
            layout="position"
            className="flex items-center gap-3 overflow-hidden"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-md">
                <User className="h-4 w-4 text-slate-300" />
              </div>
            )}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col overflow-hidden text-left"
                >
                  <span className="text-[12px] font-bold text-white truncate leading-tight">
                    {user?.name || "ผู้ดูแลระบบ uFriend"}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400/80 truncate mt-0.5">
                    {user?.email || "CX Operator"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {!isCollapsed && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={onLogout}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="end">
                ออกจากระบบ
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {isCollapsed && (
          <div className="mt-3 flex justify-center">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={onLogout}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                ออกจากระบบ
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
