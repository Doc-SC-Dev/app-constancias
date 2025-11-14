import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/better-auth/client";

export default function LogoutDialog() {
  const router = useRouter();
  const handleClick = async () => {
    await authClient.signOut();
    router.replace("/login");
  };
  return (
    <DialogContent className="w-4xl">
      <DialogHeader>
        <DialogTitle>¿Estas seguro?</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleClick}>
          Cerrar sesión
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
