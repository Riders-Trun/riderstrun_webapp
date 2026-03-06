import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import MobileBottomNav from "@/components/MobileBottomNav";

const AppLayout = () => {
  return (
    <SidebarProvider>
      {/* Sidebar - visible on md+ via shadcn sidebar internals */}
      <AppSidebar />

      {/* Main content area */}
      <SidebarInset className="flex flex-col min-h-screen min-w-0">
        <main className="flex-1 pb-20 overflow-x-hidden">
          <Outlet />
        </main>
      </SidebarInset>

      {/* Bottom nav - always visible, full width */}
      <MobileBottomNav />
    </SidebarProvider>
  );
};

export default AppLayout;
