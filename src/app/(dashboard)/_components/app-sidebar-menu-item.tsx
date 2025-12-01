"use client";
import type { LucideProps } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType, ElementType } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type Props = {
  title: string;
  url: string;
  icon: ElementType | ComponentType<LucideProps>;
};
export function AppSidebarMenuItem({ title, url, icon: Icon }: Props) {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <SidebarMenuItem key={url}>
      <SidebarMenuButton
        size="default"
        isActive={
          url === "/dashboard" ? pathName === url : pathName.includes(url)
        }
        className="rounded-none px-2"
        tooltip={title}
        onClick={() => router.push(url)}
      >
        <Icon />
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
