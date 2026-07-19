
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MapPin, Calendar, Plus, Bell, User, QrCode, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Discover Rides",
    url: "/",
    icon: MapPin,
  },
  {
    title: "Join Ride",
    url: "/join-ride",
    icon: QrCode,
  },
  {
    title: "My Rides",
    url: "/my-rides",
    icon: Calendar,
  },
  {
    title: "Plan Ride",
    url: "/plan-ride",
    icon: Plus,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  // The /admin route is guarded server-side and by AdminRoute; this only decides
  // whether the entry point is visible. Without it an admin has no way to reach
  // the screen except by typing the URL.
  const { isAdmin } = useAuth();

  return (
    <Sidebar className="border-r bg-gradient-to-b from-orange-50 to-white">
      <SidebarHeader className="p-4 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-gray-900">RidersTurn</span>
            <div className="text-xs text-orange-600 font-medium">Your Ride Partner</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-700 font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700 transition-colors">
                    <Link to={item.url} className="flex items-center gap-3 py-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-orange-700 font-semibold">Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700 transition-colors">
                    <Link to="/admin" className="flex items-center gap-3 py-3">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Admin Console</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-orange-100">
        <div className="text-center">
          <div className="text-xs text-orange-600 font-medium mb-1">
            🏍️ Discover • Join • Ride 🏍️
          </div>
          <div className="text-xs text-gray-500">
            v1.0.0 - RidersTurn
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
