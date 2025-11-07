import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppSideBarTrigger } from "./app-sidebar-trigger";

export function AppNavBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-primary">
      <div>
        <AppSideBarTrigger />
      </div>
      <div className="flex flex-row space-x-3 h-full items-center">
        <div className="flex flex-col">
          <span className="text-primary-foreground text-base font-bold">
            Nombre Usuario
          </span>
          <span className="text-primary-foreground text-xs font-normal text-right">
            Tipo usuario
          </span>
        </div>
        <Avatar>
          <AvatarImage src="/avatar.png" alt="Avatar" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
