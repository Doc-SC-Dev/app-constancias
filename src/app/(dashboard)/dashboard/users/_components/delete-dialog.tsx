import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/lib/types/users";

type DialogContentProps = {
  user: User;
  closeDialog: () => void;
};

export default function DeleteDialog({
  user,
  closeDialog,
}: DialogContentProps) {
  function handleClick() {
    closeDialog();
  }
  return (
    <DialogContent className="w-4xl">
      <DialogHeader>
        <DialogTitle>¿Estas seguro?</DialogTitle>
        <DialogDescription>
          Estas apunto de eliminar un usuario
        </DialogDescription>
      </DialogHeader>
      <div className="text-muted-foreground text-sm/normal">
        <span>Si eliminas este usuario:</span>
        <ul className="px-4 list-disc [&>li]:mt-2 py-1">
          <li>
            Toda su información y actividad dentro de la aplicación se perderá.
          </li>
          <li>No podrá volver a acceder con su cuenta.</li>
          <li>No podrás recuperar sus datos más adelante.</li>
        </ul>
        <p>Te recomendamos hacerlo solo si estás completamente seguro.</p>
        <p className="font-bold">Esta acción no se puede deshacer.</p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button variant="destructive" onClick={handleClick}>
          Eliminar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
