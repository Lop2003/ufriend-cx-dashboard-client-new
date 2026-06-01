import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white cursor-pointer"
          aria-label={isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
        >
          {/* Subtle glow behind the icon */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0"
            animate={{
              opacity: isDark ? 0.15 : 0,
              boxShadow: isDark
                ? '0 0 16px 2px rgba(100, 150, 255, 0.3)'
                : '0 0 0 0 transparent',
            }}
            transition={{ duration: 0.4 }}
          />

          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <Moon className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <Sun className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
      </TooltipContent>
    </Tooltip>
  );
}
