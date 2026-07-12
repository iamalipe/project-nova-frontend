import { Outlet } from "@tanstack/react-router";

import { AdminAppSidebar } from "@/components/admin-app-sidebar/admin-app-sidebar";
import Footer from "@/components/general/footer";
import Header from "@/components/general/header";
import MainDialog from "@/components/main-dialog/main-dialog";
import { SidebarProvider } from "@/components/ui/sidebar";

const PrivateAppLayout = () => {
  return (
    <>
      <div className="h-full-x flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden flex bg-background">
          <SidebarProvider>
            <AdminAppSidebar />
            <Outlet />
          </SidebarProvider>
        </div>
        <Footer />
      </div>
      <MainDialog />
    </>
  );
};
export default PrivateAppLayout;
