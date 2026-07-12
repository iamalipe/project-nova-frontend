import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link, type LinkProps } from "@tanstack/react-router";

export type AdminAppSidebarMenuItemProps = {
  title: string;
  url: LinkProps["to"];
  icon: React.ReactNode;
  isActive?: boolean;
};
const AdminAppSidebarMenuItem = (props: AdminAppSidebarMenuItemProps) => {
  const { title, url, isActive } = props;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        variant="default"
        isActive={isActive}
        render={<Link to={url} />}
      >
        {props.icon}
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AdminAppSidebarMenuItem;
