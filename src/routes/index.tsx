import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { PATHS } from './paths';
import PageLoader from './PageLoader';

// Page-level code splitting — แต่ละหน้าโหลดแยกกันเพื่อลดขนาด bundle
const DashboardPage   = lazy(() => import('../pages/dashboard'));
const CustomersPage   = lazy(() => import('../pages/customers'));
const FollowUpPage    = lazy(() => import('../pages/follow-up'));
const AddFeedbackPage = lazy(() => import('../pages/add-feedback'));

export default function AppRoutes() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={PATHS.DASHBOARD}    element={<DashboardPage />} />
          <Route path={PATHS.CUSTOMERS}    element={<CustomersPage />} />
          <Route path={PATHS.FOLLOW_UP}    element={<FollowUpPage />} />
          <Route path={PATHS.ADD_FEEDBACK} element={<AddFeedbackPage />} />
          <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}
