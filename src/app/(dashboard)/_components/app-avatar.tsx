"use client";
import { LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { logoutAction } from "../action";

export function AppAvatar() {
  const { handleSubmit, formState } = useForm();
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src="/avatar.png" alt="Avatar" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} collisionPadding={8}>
          <DropdownMenuItem onClick={() => {}}>
            Cambiar constraseña
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem variant="destructive">
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent className="w-sm">
        <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
        <AlertDialogDescription>
          Por seguridad, todos tus datos temporales se limpiarán y deberás
          volver a iniciar sesión para continuar.
        </AlertDialogDescription>
        <AlertDialogFooter className="flex gap-4">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/75"
            onClick={handleSubmit(logoutAction)}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting && <Spinner />}
            Cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
