"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function NavigationLink() {
  const pathname = usePathname();
  const styles = navigationMenuTriggerStyle({
    className:
      "bg-muted data-[active]:bg-background data-[active]:shadow-sm hover:data-[active]:text-foreground",
  });
  return (
    <NavigationMenu>
      <NavigationMenuList className="bg-muted rounded-lg">
        <NavigationMenuItem className="p-1">
          <NavigationMenuLink
            asChild
            className={styles}
            active={pathname === "/admin"}
          >
            <Link href="/admin">General</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="p-1">
          <NavigationMenuLink
            asChild
            className={styles}
            active={pathname.includes("/admin/grades")}
          >
            <Link href="/admin/grades">Grados Académicos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="p-1">
          <NavigationMenuLink
            asChild
            className={styles}
            active={pathname.includes("/admin/activity-types")}
          >
            <Link href="/admin/activity-types">Tipos de actividades</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="p-1">
          <NavigationMenuLink
            asChild
            className={styles}
            active={pathname.includes("/admin/certificate")}
          >
            <Link href="/admin/certificate">Certificados</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
