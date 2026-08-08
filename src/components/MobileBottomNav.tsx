import { MapPin, Calendar, Compass, Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useConfig } from "@/contexts/ConfigContext";

const navItems = [
  { icon: MapPin, label: "Discover", path: "/" },
  { icon: Calendar, label: "My Rides", path: "/my-rides" },
  { icon: Compass, label: "Explore", path: "/explore", isCenter: true, feature: "explore" as const },
  { icon: Bell, label: "Alerts", path: "/notifications", feature: "notifications" as const },
  { icon: User, label: "Profile", path: "/profile" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { isEnabled } = useConfig();

  // Items without a `feature` are core. When Explore is off the raised centre
  // button disappears with it and the remaining four space themselves evenly —
  // better than a prominent button leading to a redirect.
  const visibleItems = navItems.filter(
    (item) => item.feature === undefined || isEnabled(item.feature)
  );

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-orange-100 z-50">
      <div className="flex items-center justify-around py-2 max-w-screen-xl mx-auto">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link key={item.path} to={item.path} className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg -translate-y-2 border-4 border-white">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 min-w-[60px] transition-all duration-200",
                isActive ? "text-orange-600" : "text-gray-500"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "bg-orange-100" : "hover:bg-gray-100"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive ? "text-orange-600 scale-110" : "text-gray-500"
                )} />
              </div>
              <span className={cn(
                "text-xs font-medium mt-1 transition-all duration-200",
                isActive ? "text-orange-600" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
