"use client";

import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User } from "@/lib/types/users";
import { AppAvatar } from "./app-avatar";
import { AppSideBarTrigger } from "./app-sidebar-trigger";

type NavBarProps = {
  user: User;
};

export function AppNavBar({ user }: NavBarProps) {
  const isMobile = useIsMobile();
  return (
    <nav className="flex justify-between items-center p-4 bg-primary max-h-21 w-full sticky">
      <div className="flex gap-4 items-center">
        <Image
          src="/assets/images/logo-horizontal-blanco.png"
          alt="Logo doctorado en ciencias medicas"
          loading="eager"
          className="h-16 w-auto"
          height={64}
          width={128}
        />
        <AppSideBarTrigger />
      </div>
      {!isMobile && (
        <div className="flex space-x-3 h-full items-center justify-end px-4">
          <div className="flex flex-col">
            <span className="text-primary-foreground text-base font-bold">
              {user.name}
            </span>
            <span className="text-primary-foreground text-xs font-normal text-right">
              {user.role}
            </span>
          </div>
          <AppAvatar />
        </div>
      )}
    </nav>
  );
}
