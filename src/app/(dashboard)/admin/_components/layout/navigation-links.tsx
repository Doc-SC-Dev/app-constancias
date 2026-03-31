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
      "bg-muted text-muted-foreground data-[active]:text-foreground data-[active]:bg-background data-[active]:shadow-sm hover:data-[active]:text-foreground",
  });
  return (
    <section className="space-y-4 w-full">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      <div className="w-full overflow-x-auto">
        <NavigationMenu className="justify-start w-max-none">
          <NavigationMenuList className="bg-muted rounded-lg flex-nowrap justify-start w-max">
            <NavigationMenuItem className="p-1 shrink-0">
              <NavigationMenuLink
                asChild
                className={styles}
                active={pathname.includes("/admin/general")}
              >
                <Link href="/admin/general">General</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="p-1 shrink-0">
              <NavigationMenuLink
                asChild
                className={styles}
                active={pathname.includes("/admin/academic-degree")}
              >
                <Link href="/admin/academic-degree">Grados Académicos</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="p-1 shrink-0">
              <NavigationMenuLink
                asChild
                className={styles}
                active={pathname.includes("/admin/activity-type")}
              >
                <Link href="/admin/activity-type">Tipos de actividades</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="p-1 shrink-0">
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
      </div>
    </section>
  );
}
