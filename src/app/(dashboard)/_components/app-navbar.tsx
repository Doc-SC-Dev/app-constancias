import type { User } from "@/lib/types/users";
import { AppAvatar } from "./app-avatar";
import { AppSideBarTrigger } from "./app-sidebar-trigger";

type NavBarProps = {
  user: User;
};

export async function AppNavBar({ user }: NavBarProps) {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-primary border-l-accent">
      <div>
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
