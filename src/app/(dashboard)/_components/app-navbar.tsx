import { AppAvatar } from "./app-avatar";
import { AppSideBarTrigger } from "./app-sidebar-trigger";

export function AppNavBar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-primary top-0 sticky ">
      <div>
        <AppSideBarTrigger />
      </div>
      <div className="flex flex-row space-x-3 h-full items-center px-4">
        <div className="flex flex-col">
          <span className="text-primary-foreground text-base font-bold">
            Nombre Usuario
          </span>
          <span className="text-primary-foreground text-xs font-normal text-right">
            Tipo usuario
          </span>
        </div>
        <AppAvatar />
      </div>
    </nav>
  );
}
