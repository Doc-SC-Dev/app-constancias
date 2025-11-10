"use client";
import type { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ElementType } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type Props = {
  title: string;
  url: string;
  icon: ElementType | ComponentType<LucideProps>;
};
export function AppSidebarMenuItem({ title, url, icon: Icon }: Props) {
  const pathName = usePathname();
  return (
    <SidebarMenuItem key={url} className="h-14">
      <SidebarMenuButton
        asChild
        isActive={url === "/" ? pathName === url : pathName.includes(url)}
        className="h-full rounded-none px-5"
      >
        <Link href={`${url}`} className="h-full rounded-none">
          {/*Todo agregar chequeo de capacidadpara ver que botones mostart*/}
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
