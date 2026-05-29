import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { getMe, type AuthUser } from '@/services/authService';
import { logout as logoutApi } from '@/services/authMutations';
import { PATHS } from '@/routes/paths';

interface UseAuthOptions {
  /** ถ้า true จะ redirect ไป /login เมื่อไม่มี session (ใช้ใน protected routes) */
  requireAuth?: boolean;
}

/**
 * useAuth — จัดการ session state และ redirect logic
 * - ตรวจสอบ session ผ่าน GET /api/auth/me
 * - session หมดอายุ → toast error + redirect /login
 */
export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = false } = options;
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSessionExpired = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    toast.error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
    navigate(PATHS.LOGIN, { replace: true });
  }, [navigate]);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const me = await getMe();
      setUser(me);
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      setUser(null);
      setIsAuthenticated(false);

      const message = err instanceof Error ? err.message : '';
      const isExpired =
        message.includes('เซสชันหมดอายุ') ||
        message.includes('ERR_SESSION_EXPIRED') ||
        message.includes('401');

      if (requireAuth && isExpired) {
        handleSessionExpired();
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [requireAuth, handleSessionExpired]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // redirect ไป /login ถ้า requireAuth และไม่มี session (หลังโหลดเสร็จ)
  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      const isLoginPage = location.pathname === PATHS.LOGIN;
      if (!isLoginPage) {
        navigate(PATHS.LOGIN, { replace: true });
      }
    }
  }, [isLoading, requireAuth, isAuthenticated, location.pathname, navigate]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ลบ cookie ฝั่ง server ไม่สำเร็จก็ clear state ฝั่ง client ต่อ
    }
    setUser(null);
    setIsAuthenticated(false);
    navigate(PATHS.LOGIN, { replace: true });
  }, [navigate]);

  return {
    user,
    isLoading,
    isAuthenticated,
    checkSession,
    logout,
  };
}

export default useAuth;
