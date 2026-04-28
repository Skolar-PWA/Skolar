import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { LoadingSkeleton } from '@eduportal/ui';
import { useAuthStore } from './store/auth';
import { AppShell } from './layout/AppShell';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const StudentsPage = lazy(() => import('./pages/StudentsPage'));
const StudentDetailPage = lazy(() => import('./pages/StudentDetailPage'));
const StaffPage = lazy(() => import('./pages/StaffPage'));
const ClassesPage = lazy(() => import('./pages/ClassesPage'));
const AttendancePage = lazy(() => import('./pages/attendance/AttendancePage'));
const AttendanceMarkPage = lazy(() => import('./pages/attendance/MarkAttendancePage'));
const AttendanceScanPage = lazy(() => import('./pages/AttendanceScanPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage'));
const FeesPage = lazy(() => import('./pages/FeesPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

function ProtectedLayout() {
  const { user, hydrating, hydrate } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (hydrating) hydrate();
  }, [hydrating, hydrate]);

  if (hydrating) {
    return (
      <div style={{ padding: 32 }}>
        <LoadingSkeleton height={48} />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <AppShell>
      <AnimatedRoutes>
        <Outlet />
      </AnimatedRoutes>
    </AppShell>
  );
}

function AnimatedRoutes({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSkeleton height={200} />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/:id" element={<StudentDetailPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/attendance/mark/:sectionId" element={<AttendanceMarkPage />} />
              <Route path="/attendance/scan" element={<AttendanceScanPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/fees" element={<FeesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-900)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            borderRadius: 12,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-dropdown)',
          },
        }}
      />
    </QueryClientProvider>
  );
}
