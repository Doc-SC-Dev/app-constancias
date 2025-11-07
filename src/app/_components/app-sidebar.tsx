"use client";

import { Activity, History, Home, User, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { AppSidebarMenuItem } from "./app-sidebar-menu-item";

export function AppSideBar() {
  const items = [
    { title: "Inicio", url: "/", icon: Home },
    { title: "Usuarios", url: "/user", icon: User },
    { title: "Historial", url: "/history", icon: History },
    { title: "Estudiantes", url: "/student", icon: Users },
    { title: "Actividades", url: "/activity", icon: Activity },
  ];
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="bg-primary min-h-18"></SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="h-full p-0">
          <SidebarGroupLabel className="text-foreground text-sm h-15 px-6">
            Secciones
          </SidebarGroupLabel>
          <SidebarGroupContent className="h-full">
            <SidebarMenu className="h-full">
              {items.map((item) => (
                <AppSidebarMenuItem
                  key={item.title}
                  title={item.title}
                  url={item.url}
                  icon={item.icon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
