import { DialogTitle } from "@radix-ui/react-dialog";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangeDirectorForm from "./form/change-director-form";

export function EditDirectorDialog({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <Edit />
          Cambiar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambio de Director</DialogTitle>
          <DialogDescription>
            Selecciona un usuario de la lista para remplazar al director actual{" "}
            <strong>{name}</strong> y otorgarle el cargo de Director. Este
            usuario tendrá permisos para gestionar el departamento y supervisar
            las métricas del equipo.
          </DialogDescription>
        </DialogHeader>
        <ChangeDirectorForm userId={userId} />
      </DialogContent>
    </Dialog>
  );
}
