import AdminAppSidebarMenuItem, {
  type AdminAppSidebarMenuItemProps,
} from "@/components/admin-app-sidebar/admin-app-sidebar-menu-item"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { useLocation } from "@tanstack/react-router"
import { Home, Package } from "lucide-react"
import { NavUser } from "./nav-user"

const pageMenus: AdminAppSidebarMenuItemProps[] = [
  {
    title: "Home",
    url: "/app",
    icon: <Home />,
  },
  {
    title: "Product",
    url: "/app/product",
    icon: <Package />,
  },
]

export function AdminAppSidebar() {
  const items = [...pageMenus]
  const { pathname } = useLocation()

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
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <AdminAppSidebarMenuItem
                  key={item.url}
                  {...item}
                  isActive={pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
