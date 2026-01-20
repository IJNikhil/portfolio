import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import PublicShell from "./public/components/PublicShell";
import LandingPage from "./public/pages/LandingPage";
import { ProtectedAdminRoute } from "./admin/components/ProtectedAdminRoute";
import { PortfolioProvider } from "./shared/context/PortfolioContext";
import PortfolioLoader from "./public/components/PortfolioLoader";

// Lazy Load Admin Components for Performance
const LoginPage = lazy(() => import("./admin/pages/LoginPage"));
const DashboardPage = lazy(() => import("./admin/pages/DashboardPage"));
const ProjectsPage = lazy(() => import("./admin/pages/ProjectsPage"));
const ContentPage = lazy(() => import("./admin/pages/ContentPage"));
const SkillsPage = lazy(() => import("./admin/pages/SkillsPage"));
const AchievementsPage = lazy(() => import("./admin/pages/AchievementsPage"));
const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));
const LazyAdminInbox = lazy(() => import("./admin/components/AdminInbox"));

import { authService } from "./shared/services/authService";

// Redirect logic for /admin root
function AdminRedirect() {
  return authService.isAuthenticated() ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/admin/login" replace />;
}

function ScrollToTopRoute() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

import { Toaster } from "sonner";

import CommandPalette from "./public/components/CommandPalette";

export default function App() {
  return (
    <PortfolioProvider>
      <ScrollToTopRoute />
      <Toaster position="top-right" richColors closeButton />
      <CommandPalette />
      <PortfolioLoader>
        <Routes>
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/admin/login" element={
            <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
              <LoginPage />
            </Suspense>
          } />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route element={
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Admin...</div>}>
                <AdminLayout />
              </Suspense>
            }>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/projects" element={<ProjectsPage />} />
              <Route path="/admin/content" element={<ContentPage />} />
              <Route path="/admin/skills" element={<SkillsPage />} />
              <Route path="/admin/achievements" element={<AchievementsPage />} />
              <Route path="/admin/messages" element={<LazyAdminInbox />} />
            </Route>
          </Route>

          {/* Public Routes - Single Page Catch-all */}
          <Route
            path="*"
            element={
              <PublicShell>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<LandingPage />} />
                  <Route path="*" element={<LandingPage />} />
                </Routes>
              </PublicShell>
            }
          />
        </Routes>
      </PortfolioLoader>
    </PortfolioProvider>
  );
}