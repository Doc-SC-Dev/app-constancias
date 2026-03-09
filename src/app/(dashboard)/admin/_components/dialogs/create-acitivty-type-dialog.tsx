import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateActivityTypeForm from "../form/create-activity-type-form";

export default function CreateActivityTypeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Crear tipo de actividad
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea un nuevo tipo de actividad</DialogTitle>
          <DialogDescription>
            Establece el nombre de la categoría y los requisitos de asistencia.
            Añade tipos de participantes y marca como "Obligatorio" aquellos que
            sean indispensables para este registro.
          </DialogDescription>
        </DialogHeader>
        <CreateActivityTypeForm />
      </DialogContent>
    </Dialog>
  );
}
