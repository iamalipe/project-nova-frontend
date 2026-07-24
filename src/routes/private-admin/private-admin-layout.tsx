import { Outlet } from "@tanstack/react-router";

import { AdminAppSidebar } from "@/components/admin-app-sidebar/admin-app-sidebar";
import Footer from "@/components/general/footer";
import Header from "@/components/general/header";
import MainDialog from "@/components/main-dialog/main-dialog";
import { SidebarProvider } from "@/components/ui/sidebar";

const PrivateAppLayout = () => {
  return (
    <SidebarProvider>
      <div className="h-full-x flex flex-col overflow-hidden w-full">
        <Header />
        <div className="flex-1 overflow-hidden flex bg-background">
          <AdminAppSidebar />
          <Outlet />
        </div>
        <Footer />
      </div>
      <MainDialog />
    </SidebarProvider>
  );
};
export default PrivateAppLayout;
