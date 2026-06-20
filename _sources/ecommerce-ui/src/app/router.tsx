import { Navigate, Route, Routes } from "react-router-dom";
import { AccountPage } from "../features/account/AccountPage";
import { AdminDashboardPage } from "../features/admin/AdminDashboardPage";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { ResetPasswordPage } from "../features/auth/pages/ResetPasswordPage";
import { VerifyEmailPage } from "../features/auth/pages/VerifyEmailPage";
import { StatusPage } from "../features/status/StatusPage";
import { AppLayout } from "../shared/layouts/AppLayout";
import { AuthLayout } from "../shared/layouts/AuthLayout";
import { AdminRoute } from "../shared/auth/AdminRoute";
import { ProtectedRoute } from "../shared/auth/ProtectedRoute";
import { ComingSoonPage } from "../shared/pages/ComingSoonPage";
import { NotFoundPage } from "../shared/pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/status" element={<StatusPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          }
        />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
