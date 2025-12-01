"use client";
import { Activity, History, Home, User as UserIcon, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User } from "@/lib/types/users";
import { AppAvatar } from "./app-avatar";
import { AppSidebarMenuItem } from "./app-sidebar-menu-item";

type SideBarProps = {
  hasUser: boolean;
  hasActivities: boolean;
  hasRequest: boolean;
  user: User;
};

export function AppSideBar({
  hasActivities,
  hasRequest,
  hasUser,
  user,
}: SideBarProps) {
  const isMobile = useIsMobile();
  const items = [
    { title: "Inicio", url: "/dashboard", icon: Home, permission: true },
    {
      title: "Usuarios",
      url: "/dashboard/users",
      icon: UserIcon,
      permission: hasUser,
    },
    {
      title: "Constancias",
      url: "/dashboard/history",
      icon: History,
      permission: hasRequest,
    },
    {
      title: "Estudiantes",
      url: "/dashboard/student",
      icon: Users,
      permission: hasUser,
    },
    {
      title: "Actividades",
      url: "/dashboard/activity",
      icon: Activity,
      permission: hasActivities,
    },
  ];
  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
      className="group-data-[side=left]:border-0"
    >
      <SidebarHeader className="bg-primary min-h-21 border-accent">
        {isMobile && (
          <div className="flex space-x-3 h-full items-center justify-start px-4">
            <AppAvatar />
            <div className="flex flex-col">
              <span className="text-primary-foreground text-base font-bold">
                {user.name}
              </span>
              <span className="text-primary-foreground text-xs font-normal text-start">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="h-full px-0">
          <SidebarGroupLabel className="text-foreground text-sm h-15 px-6">
            Secciones
          </SidebarGroupLabel>
          <SidebarMenu className="h-full">
            {items.map((item) =>
              item.permission ? (
                <AppSidebarMenuItem
                  key={item.title}
                  title={item.title}
                  url={item.url}
                  icon={item.icon}
                />
              ) : (
                ""
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
