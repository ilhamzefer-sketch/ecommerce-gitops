import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute } from "../shared/auth/AdminRoute";
import { ProtectedRoute } from "../shared/auth/ProtectedRoute";
import { AppLayout } from "../shared/layouts/AppLayout";
import { AuthLayout } from "../shared/layouts/AuthLayout";
import { PageLoader } from "../shared/ui/PageLoader";

const LoginPage = lazy(() => import("../features/auth/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage").then((module) => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage").then((module) => ({ default: module.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import("../features/auth/pages/VerifyEmailPage").then((module) => ({ default: module.VerifyEmailPage })));
const StatusPage = lazy(() => import("../features/status/StatusPage").then((module) => ({ default: module.StatusPage })));
const WorkspaceChooserPage = lazy(() => import("../features/workspace/WorkspaceChooserPage").then((module) => ({ default: module.WorkspaceChooserPage })));
const MarketplacePage = lazy(() => import("../features/products/MarketplacePage").then((module) => ({ default: module.MarketplacePage })));
const ProductDetailPage = lazy(() => import("../features/products/ProductDetailPage").then((module) => ({ default: module.ProductDetailPage })));
const ShopApplicationPage = lazy(() => import("../features/shop/ShopApplicationPage").then((module) => ({ default: module.ShopApplicationPage })));
const ShopStatusPage = lazy(() => import("../features/shop/ShopStatusPage").then((module) => ({ default: module.ShopStatusPage })));
const SellerDashboardPage = lazy(() => import("../features/shop/SellerDashboardPage").then((module) => ({ default: module.SellerDashboardPage })));
const AdminDashboardPage = lazy(() => import("../features/admin/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage })));
const AccountPage = lazy(() => import("../features/account/AccountPage").then((module) => ({ default: module.AccountPage })));
const NotFoundPage = lazy(() => import("../shared/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));

function ProtectedPage({ children }: { children: JSX.Element }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader label="Səhifə hazırlanır" />}>
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
          <Route path="/choose-workspace" element={<ProtectedPage><WorkspaceChooserPage /></ProtectedPage>} />
          <Route path="/marketplace" element={<ProtectedPage><MarketplacePage /></ProtectedPage>} />
          <Route path="/products/:slug" element={<ProtectedPage><ProductDetailPage /></ProtectedPage>} />
          <Route path="/seller/apply" element={<ProtectedPage><ShopApplicationPage /></ProtectedPage>} />
          <Route path="/seller/status" element={<ProtectedPage><ShopStatusPage /></ProtectedPage>} />
          <Route path="/seller" element={<ProtectedPage><SellerDashboardPage /></ProtectedPage>} />
          <Route path="/account" element={<ProtectedPage><AccountPage /></ProtectedPage>} />
          <Route path="/admin" element={<Navigate to="/admin/shops" replace />} />
          <Route path="/admin/shops" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
