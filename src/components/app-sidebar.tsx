import {
  CookingPot,
  ScrollText,
  ShoppingBasket,
  UserPen,
  Users,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const menuItems = [
    {
      name: "Usuarios",
      icon: Users,
      link: "/users",
    },
    {
      name: "Clientes",
      icon: UserPen,
      link: "/clients",
    },
    {
      name: "Presupuestos",
      icon: ScrollText,
      link: "/",
    },
    {
      name: "Recetas",
      icon: CookingPot,
      link: "/recipe",
    },
    {
      name: "Ingredientes",
      icon: ShoppingBasket,
      link: "/ingredients",
    },
  ];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link href={item.link}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
