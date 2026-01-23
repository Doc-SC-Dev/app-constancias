"use client";

import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textos } from "@/lib/utils";
import type { User } from "@/lib/types/users";
import logoImg from "../../../../public/assets/images/logo-horizontal-blanco.png";
import { AppAvatar } from "./app-avatar";
import { AppSideBarTrigger } from "./app-sidebar-trigger";

type NavBarProps = {
  user: User;
};

export function AppNavBar({ user }: NavBarProps) {
  const isMobile = useIsMobile();
  return (
    <header className="flex justify-between items-center p-4 bg-primary max-h-21 w-full sticky">
      <div className="flex gap-4 items-center w-1/2">
        <Image
          src={logoImg}
          alt="Logo doctorado en ciencias medicas"
          loading="eager"
          priority
          height={60}
          className="w-auto"
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
              {Textos.Role[user.role as string] || user.role}
            </span>
          </div>
          <AppAvatar />
        </div>
      )}
    </header>
  );
}
