import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/auth" element={<AuthScreen />} />
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
                    <Route path="/location-planner" element={<LocationPlannerScreen />} />
                    <Route path="/travel-diary" element={<TravelDiaryScreen />} />
                    <Route path="/explore" element={<ExploreScreen />} />
                    <Route path="/route-discovery/:id" element={<RouteDiscoveryScreen />} />
                    <Route path="/route-discovery" element={<RouteDiscoveryScreen />} />
                    <Route path="/notifications" element={<NotificationsScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
