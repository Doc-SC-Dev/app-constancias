"use client";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutDialog from "./logout-dialog";
import NewPasswordDialog from "./password-dialog";

export function AppAvatar() {
  const [action, setAction] = useState<"logout" | "password">("logout");
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src="/avatar.png" alt="Avatar" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} collisionPadding={8}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setAction("password");
              }}
            >
              Cambiar constraseña
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                setAction("logout");
              }}
            >
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      {action === "logout" && <LogoutDialog />}
      {action === "password" && (
        <NewPasswordDialog closeDialog={() => setOpen(false)} />
      )}
    </Dialog>
  );
}
