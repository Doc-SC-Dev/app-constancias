import Image from "next/image";
import type { User } from "@/lib/types/users";
import { AppAvatar } from "./app-avatar";
import { AppSideBarTrigger } from "./app-sidebar-trigger";

type NavBarProps = {
  user: User;
};

export async function AppNavBar({ user }: NavBarProps) {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-primary max-h-21">
      <div className="flex gap-4 items-center">
        <Image
          src="/assets/images/logo-horizontal-blanco.png"
          alt="Logo doctorado ciencias medicas"
          width={160}
          height={74}
          loading="eager"
        />
        <AppSideBarTrigger />
      </div>
      <div className="flex flex-row space-x-3 h-full items-center px-4">
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
    </nav>
  );
}
