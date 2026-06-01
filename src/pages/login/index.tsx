import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { PATHS } from '@/routes/paths';
import LoginSkeleton from './components/LoginSkeleton';
import brandIcon from '@/assets/Icon.png';

const API_URL = import.meta.env.VITE_API_URL;

// Custom Lark Bird Logo SVG for the login button
const LarkIcon = () => (
  <svg className="mr-2 h-5 w-5 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM27.8 31.7C27.8 33 26.7 34.1 25.4 34.1H22.6C21.3 34.1 20.2 33 20.2 31.7V30H27.8V31.7ZM31 27.5H17V19.5C17 15.6 20.1 12.5 24 12.5C27.9 12.5 31 15.6 31 19.5V27.5Z" fill="currentColor"/>
    <path d="M24 16C22.1 16 20.5 17.6 20.5 19.5V24.5H27.5V19.5C27.5 17.6 25.9 16 24 16Z" fill="white"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, isAuthenticated } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Success / error toast handlers
  useEffect(() => {
    if (searchParams.get('login') === 'success') {
      toast.success('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับกลับเข้าสู่ระบบ');
      setSearchParams({}, { replace: true });
    }
    const error = searchParams.get('error');
    if (error) {
      toast.error(decodeURIComponent(error));
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Already authenticated -> redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(PATHS.DASHBOARD, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogin = () => {
    setIsRedirecting(true);
    toast.info('กำลังนำคุณไปยังระบบยืนยันตัวตนของ Lark...');
    setTimeout(() => {
      window.location.href = `${API_URL}/api/auth/lark`;
    }, 800);
  };

  if (isLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#F4F8FC] text-slate-800 antialiased md:grid md:grid-cols-12">
      {/* Decorative ambient blobs for background depth */}
      <div className="absolute right-[5%] top-[10%] -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute right-[15%] bottom-[10%] -z-10 h-80 w-80 rounded-full bg-yellow-400/10 blur-[90px] pointer-events-none" />

      {/* LEFT COLUMN: Premium product preview and metrics (Hidden on Mobile/Tablet < md) */}
      <div className="relative hidden md:col-span-6 lg:col-span-7 md:flex flex-col justify-between p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-[#002D8B] via-[#0051bb] to-[#011C57] text-white shadow-[20px_0_40px_rgba(0,0,0,0.15)] select-none">
        
        {/* Deep saturated background ambient glow spots */}
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-400/20 blur-[60px] pointer-events-none" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -15, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[10%] -right-10 h-96 w-96 rounded-full bg-yellow-300/10 blur-[70px] pointer-events-none" 
        />

        {/* Top brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -3 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.15)]"
          >
            <img src={brandIcon} alt="uFriend" className="h-6 w-6 object-contain" />
          </motion.div>
          <div>
            <h2 className="text-lg font-black tracking-wider leading-none">
              <span className="text-[#ffdb1b]">U</span>friend
            </h2>
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
              Customer Experience
            </span>
          </div>
        </div>

        {/* Middle contents: Slogan + Floating live interactive dashboard mockups */}
        <div className="relative z-10 my-auto flex flex-col gap-8 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#ffdb1b] border border-white/10 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ระบบวิเคราะห์คำติชมลูกค้า (Customer Experience)</span>
            </div>
            <h1 className="text-3xl lg:text-4xl xl:text-[42px] font-extrabold leading-[1.15] tracking-tight">
              รวบรวมทุกความคิดเห็น <br />
              เพื่อการดูแลและยกระดับบริการ <span className="text-[#ffdb1b] bg-gradient-to-r from-[#ffdb1b] to-yellow-300 bg-clip-text text-transparent">ระดับมืออาชีพ</span>
            </h1>
            <p className="text-slate-200/80 text-sm lg:text-base font-medium leading-relaxed max-w-md">
              uFriend CX Dashboard เชื่อมโยงทุกคำติชมของลูกค้าเข้าด้วยกัน ช่วยวิเคราะห์ข้อมูลความพึงพอใจ ค้นหาข้อบกพร่อง และช่วยให้ตอบสนองเพื่อปรับปรุงคุณภาพบริการได้อย่างตรงจุดและรวดเร็ว
            </p>
          </motion.div>

          {/* Graphical Mockups (Interactive floating cards) */}
          <div className="relative mt-4 space-y-4">
            
            {/* Widget 1: CSAT Score Indicator */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="flex items-center justify-between rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-w-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffdb1b]/20 text-[#ffdb1b]">
                  <Heart className="h-5 w-5 fill-[#ffdb1b]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">เปอร์เซ็นต์ความพึงพอใจ (CSAT)</p>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">98.6% <span className="text-emerald-400 text-xs font-semibold">(+2.4% vs L.W)</span></h3>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span className="text-[9px] text-emerald-400 font-bold mt-1">Excellent</span>
              </div>
            </motion.div>

            {/* Widget 2: Recent Feedbacks Stream */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-w-md ml-6 lg:ml-12"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#ffdb1b]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">คำติชมและคะแนนล่าสุดจากลูกค้า</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-2 text-left">
                <div className="rounded-xl bg-white/5 border border-white/5 p-2.5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-white">คุณ เมธาพร (สาขาพารากอน)</span>
                    <span className="inline-flex rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5">ชื่นชอบมาก</span>
                  </div>
                  <p className="text-[11px] text-slate-200 line-clamp-1 leading-snug">
                    "เจ้าหน้าที่ให้ข้อมูลครบถ้วน รวดเร็วและมีความสุภาพมากค่ะ ประทับใจ"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Widget 3: Task Completion Rate */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-w-xs ml-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-300">อัตราการตอบกลับสำเร็จ (SLA)</p>
                <h4 className="text-sm font-extrabold text-white">100% ภายใน 24 ชั่วโมง</h4>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/50 font-medium">
          <span>© {new Date().getFullYear()} uFriend Services. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Vite Production v2.0</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Login Card & SSO Access */}
      <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between min-h-screen p-8 lg:p-12 z-10">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex items-center justify-between md:hidden py-2 border-b border-slate-200/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0051bb] shadow-md">
              <img src={brandIcon} alt="uFriend" className="h-5 w-5 object-contain" />
            </div>
            <span className="text-sm font-extrabold text-slate-900">uFriend CX</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
            v2.0.0
          </span>
        </div>

        {/* Center Container: Glass Card login options */}
        <div className="my-auto w-full max-w-[400px] mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="glass-card relative rounded-3xl border border-white/70 p-7 lg:p-9 shadow-[0_20px_50px_rgba(0,81,186,0.08)] bg-white/75 backdrop-blur-xl text-center"
          >
            {/* Top Logo branding */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white via-slate-50 to-[#F4F8FC] shadow-[0_12px_24px_-8px_rgba(0,81,186,0.25),inset_0_1px_1px_white] border border-slate-200/60"
              >
                <img 
                  src={brandIcon} 
                  alt="uFriend Logo" 
                  className="h-10 w-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                />
              </motion.div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  เข้าสู่ระบบ uFriend CX
                </h3>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed px-2">
                  ยินดีต้อนรับสู่แผงควบคุมระบบจัดการคำติชมและวิเคราะห์ประสบการณ์ลูกค้า uFriend CX
                </p>
              </div>
            </div>

            {/* Login Action Trigger */}
            <div className="mt-8 space-y-3">
              <AnimatePresence mode="wait">
                {!isRedirecting ? (
                  <motion.div
                    key="login-btn-container"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Button
                      onClick={handleLogin}
                      size="lg"
                      className="w-full relative overflow-hidden bg-gradient-to-r from-[#0051bb] to-[#003da6] hover:from-[#004bb0] hover:to-[#003798] text-white hover:text-white font-extrabold rounded-2xl shadow-[0_8px_20px_rgba(0,81,186,0.2)] hover:shadow-[0_12px_28px_rgba(0,81,186,0.35)] transition-all duration-300 group py-6.5 text-[14px]"
                    >
                      <motion.span 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center w-full"
                      >
                        <LarkIcon />
                        <span>เข้าสู่ระบบผ่านบัญชี Lark</span>
                        <ArrowRight className="ml-2 h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </motion.span>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="redirecting-container"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-4 space-y-3"
                  >
                    <div className="h-6 w-6 animate-spin rounded-full border-3 border-[#0051bb] border-t-transparent" />
                    <span className="text-xs font-bold text-[#0051bb] animate-pulse">
                      กำลังเปลี่ยนเส้นทางอย่างปลอดภัย...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-center gap-2 pt-2 text-[10.5px] font-bold text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>เชื่อมต่อระบบยืนยันตัวตนอย่างปลอดภัยผ่าน Lark OAuth 2.0</span>
              </div>
            </div>
          </motion.div>

          {/* Quick instructions / Help */}
          <div className="rounded-2xl bg-white/40 border border-slate-200/30 p-4 text-left shadow-sm">
            <div className="flex gap-3">
              <Building2 className="h-4.5 w-4.5 text-[#0051bb] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-slate-800">ปัญหาในการเข้าสู่ระบบ?</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-medium">
                  สิทธิ์การเข้าใช้งานระบบจะได้รับการเปิดใช้งานโดยผู้ดูแลระบบ (Admin) หรือฝ่ายไอที กรุณาเชื่อมต่อผ่าน Lark เพื่อตรวจสอบสิทธิ์ใช้งานของคุณ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (Mobile view layout) */}
        <div className="text-center text-[10.5px] font-bold text-slate-400 md:pt-4">
          <span className="md:hidden">© {new Date().getFullYear()} uFriend Services. • </span>
          <span>เฉพาะบุคลากรขององค์กรที่ได้รับอนุญาตเท่านั้น</span>
        </div>
      </div>
    </div>
  );
}
