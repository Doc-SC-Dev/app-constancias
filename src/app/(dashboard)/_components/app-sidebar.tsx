"use client";
import {
  Activity,
  History,
  Home,
  Settings,
  User as UserIcon,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { Role } from "@/generated/prisma";
import { useIsMobile } from "@/hooks/use-mobile";
import { isAdmin } from "@/lib/authorization/permissions";
import type { User } from "@/lib/types/users";
import { Textos } from "@/lib/utils";
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
      title: "Solicitudes",
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
                {Textos.Role[user.role as string] || user.role}
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="h-full py-2">
        <SidebarGroup className="px-0">
          <SidebarMenu className="h-full gap-0">
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
      <SidebarFooter className="px-0">
        {isAdmin(user.role as Role) && (
          <SidebarMenu>
            <AppSidebarMenuItem
              title="Ajustes"
              url="/admin?tab=general"
              icon={Settings}
            />
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
