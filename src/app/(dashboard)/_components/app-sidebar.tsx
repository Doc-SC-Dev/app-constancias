"use client";
import { Activity, History, Home, User, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { AppSidebarMenuItem } from "./app-sidebar-menu-item";

type SideBarProps = {
  hasUser: boolean;
  hasActivities: boolean;
  hasRequest: boolean;
};

export function AppSideBar({
  hasActivities,
  hasRequest,
  hasUser,
}: SideBarProps) {
  const items = [
    { title: "Inicio", url: "/", icon: Home, permission: true },
    {
      title: "Usuarios",
      url: "/dashboard/users",
      icon: User,
      permission: hasUser,
    },
    {
      title: "Historial",
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
      <SidebarHeader className="bg-primary min-h-21 border-accent"></SidebarHeader>
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
