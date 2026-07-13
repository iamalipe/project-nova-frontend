"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import apiQuery from "@/hooks/use-api-query";
import useCurrentUser from "@/hooks/use-current-user";
import { Link, useNavigate } from "@tanstack/react-router";
import { BellIcon, CreditCardIcon, EllipsisVertical, LogOutIcon, UserCircleIcon } from "lucide-react";
import { toast } from "sonner";

export function NavUser() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const avatar = currentUser?.profileImage || "";
  const fullName = `${currentUser?.firstName || ""} ${
    currentUser?.lastName || ""
  }`;
  const email = currentUser?.email || "";
  const nameShort = `${currentUser?.firstName?.[0] || ""}${
    currentUser?.lastName?.[0] || ""
  }`.toUpperCase();

  const onLogout = async () => {
    await apiQuery.auth.logoutUser();
    navigate({ to: "/login" });
    // Implement logout functionality here
    toast.success("Logged out successfully");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} alt={fullName} />
              <AvatarFallback>
                {nameShort}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{fullName}</span>
              <span className="text-muted-foreground truncate text-xs">
                {email}
              </span>
            </div>
            <EllipsisVertical className="ml-auto size-4"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={avatar} alt={fullName} />
                    <AvatarFallback className="rounded-lg">
                      {nameShort}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{fullName}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link to="/app/settings/profile" />}>
                <UserCircleIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/app/settings/billing" />}>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/app/settings/notifications" />}>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
