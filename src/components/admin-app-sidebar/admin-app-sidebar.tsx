import AdminAppSidebarMenuItem, {
  type AdminAppSidebarMenuItemProps,
} from "@/components/admin-app-sidebar/admin-app-sidebar-menu-item";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ChartAreaIcon, Home, MessageSquare, Package, SquareKanban } from "lucide-react";
import { NavUser } from "./nav-user";

const pageMenus: AdminAppSidebarMenuItemProps[] = [
  {
    title: "Home",
    url: "/admin",
    icon: <Home />,
  },
  {
    title: "Product",
    url: "/admin/product",
    icon: <Package />,
  },
  {
    title: "Kanban",
    url: "/admin/kanban",
    icon: <SquareKanban />,
  },
  {
    title: "AI Chat",
    url: "/admin/ai-chat",
    icon: <ChartAreaIcon />,
  },
  {
    title: "React AI Chat",
    url: "/admin/chat-react",
    icon: <MessageSquare />,
  },
];

export function AdminAppSidebar() {
  const items = [...pageMenus];

  return (
    <Sidebar
      className="mt-16 mb-12 h-[calc(100svh-5.5rem)]"
      variant="floating"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Pages</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <AdminAppSidebarMenuItem key={item.url} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
