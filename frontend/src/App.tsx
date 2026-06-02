// ============================================================
// App.tsx — Root router with all 16 routes
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import AppLayout from '@/components/layout/AppLayout'

// Guards
import ProtectedRoute from '@/routes/ProtectedRoute'
import RoleRoute from '@/routes/RoleRoute'

// Public pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import SubmitPage from '@/pages/SubmitPage'
import TrackPage from '@/pages/TrackPage'
import TrackResultPage from '@/pages/TrackResultPage'

// Authenticated pages
import DashboardPage from '@/pages/DashboardPage'
import CaseListPage from '@/pages/CaseListPage'
import CaseDetailPage from '@/pages/CaseDetailPage'
import EvidenceDetailPage from '@/pages/EvidenceDetailPage'
import ReportsPage from '@/pages/ReportsPage'
import AnalyticsPage from '@/pages/AnalyticsPage'

// Admin pages
import AdminOverviewPage from '@/pages/AdminOverviewPage'
import AdminUsersPage from '@/pages/AdminUsersPage'
import AdminCustodyPage from '@/pages/AdminCustodyPage'
import AdminSettingsPage from '@/pages/AdminSettingsPage'

// 404
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public routes ─────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/track/:caseNumber" element={<TrackResultPage />} />
          </Route>

          {/* Auth routes (no layout wrapper — they have their own full-page layouts) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Authenticated routes ───────────────────────── */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/cases" element={<CaseListPage />} />
            <Route path="/dashboard/cases/:caseId" element={<CaseDetailPage />} />
            <Route path="/dashboard/cases/:caseId/evidence/:evidenceId" element={<EvidenceDetailPage />} />
            <Route path="/dashboard/reports" element={<ReportsPage />} />
            <Route
              path="/dashboard/analytics"
              element={
                <RoleRoute allowedRoles={['supervisor', 'super_admin']}>
                  <AnalyticsPage />
                </RoleRoute>
              }
            />
          </Route>

          {/* ── Admin routes ───────────────────────────────── */}
          <Route
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['super_admin']}>
                  <AppLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminOverviewPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/custody" element={<AdminCustodyPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* ── Redirects & 404 ─────────────────────────────── */}
          <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
