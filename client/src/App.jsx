import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import ProtectedRoute from './components/shared/ProtectedRoute';
import HomePage from './features/home/HomePage';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ReportsPage from './features/dashboard/ReportsPage';
import SettingsPage from './features/dashboard/SettingsPage';
import InquiryDetail from './features/inquiries/InquiryDetailPage';
import NotFoundPage from './features/not-found/NotFoundPage';

function PublicShell({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AdminShell({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicShell>
              <HomePage />
            </PublicShell>
          }
        />
        <Route
          path="/admin/login"
          element={
            <AdminShell>
              <LoginPage />
            </AdminShell>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminShell>
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </AdminShell>
          }
        />
        <Route
          path="/admin/inquiries/:id"
          element={
            <AdminShell>
              <ProtectedRoute>
                <InquiryDetail />
              </ProtectedRoute>
            </AdminShell>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminShell>
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            </AdminShell>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminShell>
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            </AdminShell>
          }
        />
        <Route
          path="*"
          element={
            <PublicShell>
              <NotFoundPage />
            </PublicShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
