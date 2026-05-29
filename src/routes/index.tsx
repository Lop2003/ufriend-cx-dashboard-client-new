import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { PATHS } from './paths';
import PageLoader from './PageLoader';
import { useAuth } from '@/hooks/useAuth';

// Page-level code splitting — แต่ละหน้าโหลดแยกกันเพื่อลดขนาด bundle
const DashboardPage   = lazy(() => import('../pages/dashboard'));
const CustomersPage   = lazy(() => import('../pages/customers'));
const FollowUpPage    = lazy(() => import('../pages/follow-up'));
const AddFeedbackPage = lazy(() => import('../pages/add-feedback'));
const LoginPage       = lazy(() => import('../pages/login'));

/** Layout ที่ต้องมี session — ไม่มีจะ redirect ไป /login */
function ProtectedLayout() {
  const { isLoading, isAuthenticated } = useAuth({ requireAuth: true });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={PATHS.LOGIN}
        element={
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route element={<ProtectedLayout />}>
        <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
        <Route path={PATHS.CUSTOMERS} element={<CustomersPage />} />
        <Route path={PATHS.FOLLOW_UP} element={<FollowUpPage />} />
        <Route path={PATHS.ADD_FEEDBACK} element={<AddFeedbackPage />} />
        <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
      </Route>
    </Routes>
  );
}
