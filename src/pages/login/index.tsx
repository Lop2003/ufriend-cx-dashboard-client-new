import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { PATHS } from '@/routes/paths';
import LoginSkeleton from './components/LoginSkeleton';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * หน้า Login — เข้าสู่ระบบด้วย Lark OAuth
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, isAuthenticated } = useAuth();

  // แสดง toast เมื่อ login สำเร็จจาก callback redirect
  useEffect(() => {
    if (searchParams.get('login') === 'success') {
      toast.success('เข้าสู่ระบบสำเร็จ');
      setSearchParams({}, { replace: true });
    }
    const error = searchParams.get('error');
    if (error) {
      toast.error(decodeURIComponent(error));
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // มี session อยู่แล้ว → redirect ไปหน้าแรก
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(PATHS.DASHBOARD, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogin = () => {
    window.location.href = `${API_URL}/api/auth/lark`;
  };

  if (isLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>UFriend CX Dashboard</CardTitle>
          <CardDescription>เข้าสู่ระบบเพื่อจัดการข้อมูลลูกค้า</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" onClick={handleLogin}>
            เข้าสู่ระบบด้วย Lark
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
