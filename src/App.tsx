import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ConfigProvider, useConfig } from "@/contexts/ConfigContext";
import type { AppConfig } from "@/config/appConfig";
import AppLayout from "@/components/layout/AppLayout";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
  </div>
);

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <Outlet />;
};

const AdminRoute = () => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

/**
 * Hides a screen the server says is not built yet.
 *
 * Some screens have no endpoints behind them, so rendering them shows an empty
 * shell that reads as broken. Redirecting instead means a feature only appears
 * once it actually works — and switching one on is a server config change, not
 * a release.
 *
 * Deliberately no loading state: config resolves from cache or bundled defaults
 * synchronously, so gating never flashes a spinner.
 */
const FeatureRoute = ({ feature }: { feature: keyof AppConfig["features"] }) => {
  const { isEnabled } = useConfig();
  if (!isEnabled(feature)) return <Navigate to="/" replace />;
  return <Outlet />;
};

const HomeScreen = lazy(() => import("@/components/screens/HomeScreen"));
const RideDetailsScreen = lazy(() => import("@/components/screens/RideDetailsScreen"));
const MyRidesScreen = lazy(() => import("@/components/screens/MyRidesScreen"));
const PlanRideScreen = lazy(() => import("@/components/screens/PlanRideScreen"));
const LocationPlannerScreen = lazy(() => import("@/components/screens/LocationPlannerScreen"));
const TravelDiaryScreen = lazy(() => import("@/components/screens/TravelDiaryScreen"));
const RouteDiscoveryScreen = lazy(() => import("@/components/screens/RideDiscoveryScreen"));
const ExploreScreen = lazy(() => import("@/components/screens/ExploreScreen"));
const NotificationsScreen = lazy(() => import("@/components/screens/NotificationsScreen"));
const ProfileScreen = lazy(() => import("@/components/screens/ProfileScreen"));
const ForgotPasswordScreen = lazy(() => import("@/components/screens/ForgotPasswordScreen"));
const ResetPasswordScreen = lazy(() => import("@/components/screens/ResetPasswordScreen"));
const JoinRideScreen = lazy(() => import("@/components/screens/JoinRideScreen"));
const AuthScreen = lazy(() => import("@/components/screens/AuthScreen"));
const AdminScreen = lazy(() => import("@/components/screens/AdminScreen"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      {/* Outside AuthProvider: config is public and the sign-in screen renders
          from it, so it must not depend on being authenticated. */}
      <ConfigProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/auth" element={<AuthScreen />} />
                {/* Public, like /auth: someone who cannot sign in cannot be behind the guard.
                    Flagged off until the server has an email provider to deliver the link. */}
                <Route element={<FeatureRoute feature="passwordReset" />}>
                  <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                  <Route path="/reset-password" element={<ResetPasswordScreen />} />
                </Route>
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminScreen />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/join-ride" element={<JoinRideScreen />} />
                    <Route path="/ride/:id" element={<RideDetailsScreen />} />
                    <Route path="/my-rides" element={<MyRidesScreen />} />
                    <Route path="/plan-ride" element={<PlanRideScreen />} />
                    <Route element={<FeatureRoute feature="locationPlanner" />}>
                      <Route path="/location-planner" element={<LocationPlannerScreen />} />
                    </Route>
                    <Route element={<FeatureRoute feature="travelDiary" />}>
                      <Route path="/travel-diary" element={<TravelDiaryScreen />} />
                    </Route>
                    <Route element={<FeatureRoute feature="explore" />}>
                      <Route path="/explore" element={<ExploreScreen />} />
                    </Route>
                    <Route element={<FeatureRoute feature="rideDiscovery" />}>
                      <Route path="/route-discovery/:id" element={<RouteDiscoveryScreen />} />
                      <Route path="/route-discovery" element={<RouteDiscoveryScreen />} />
                    </Route>
                    <Route element={<FeatureRoute feature="notifications" />}>
                      <Route path="/notifications" element={<NotificationsScreen />} />
                    </Route>
                    <Route path="/profile" element={<ProfileScreen />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
