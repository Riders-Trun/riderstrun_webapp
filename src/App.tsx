import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import HomeScreen from "@/components/screens/HomeScreen";
import RideDetailsScreen from "@/components/screens/RideDetailsScreen";
import MyRidesScreen from "@/components/screens/MyRidesScreen";
import PlanRideScreen from "@/components/screens/PlanRideScreen";
import LocationPlannerScreen from "@/components/screens/LocationPlannerScreen";
import TravelDiaryScreen from "@/components/screens/TravelDiaryScreen";
import RouteDiscoveryScreen from "@/components/screens/RideDiscoveryScreen";
import ExploreScreen from "@/components/screens/ExploreScreen";
import NotificationsScreen from "@/components/screens/NotificationsScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import JoinRideScreen from "@/components/screens/JoinRideScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
