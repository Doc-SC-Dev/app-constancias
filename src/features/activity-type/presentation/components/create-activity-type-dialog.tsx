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
import CreateActivityTypeForm from "./create-activity-type-form";

export default function CreateActivityTypeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear tipo de actividad
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crea un nuevo tipo de actividad</DialogTitle>
          <DialogDescription>
            Define el nombre y los roles de participación requeridos.
          </DialogDescription>
        </DialogHeader>
        <CreateActivityTypeForm />
      </DialogContent>
    </Dialog>
  );
}
