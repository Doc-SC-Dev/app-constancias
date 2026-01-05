"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { ActivityDTO } from "@/lib/types/activity";
import { deleteActivity } from "../actions";

type DialogContentProps = {
  data: ActivityDTO;
  closeDialog?: () => void;
};

export default function DeleteDialog({
  data: activity,
  closeDialog,
}: DialogContentProps) {
  const router = useRouter();
  const form = useForm();
  async function handleClick() {
    const { success, message } = await deleteActivity({
      activityId: activity.id,
    });
    if (!success) {
      toast.error(message);
      router.replace("/dashboard/activity");
    } else {
      toast.success(`Se eliminó exitosamente la actividad ${activity.name}`);
    }
    if (closeDialog) closeDialog();
  }

  return (
    <DialogContent className="w-4xl">
      <DialogHeader>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogDescription>
          Estás a punto de eliminar una actividad
        </DialogDescription>
      </DialogHeader>
      <div className="text-muted-foreground text-sm/normal">
        <span>Si eliminas esta actividad:</span>
        <ul className="px-4 list-disc [&>li]:mt-2 py-1">
          <li>Se eliminará permanentemente del sistema.</li>
          <li>Los participantes asociados perderán este registro.</li>
        </ul>
        <p>Te recomendamos hacerlo solo si estás completamente seguro.</p>
        <p className="font-bold">Esta acción no se puede deshacer.</p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <form onSubmit={form.handleSubmit(handleClick)}>
          <Button
            variant="destructive"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? "Eliminando..." : "Eliminar"}
          </Button>
        </form>
      </DialogFooter>
    </DialogContent>
  );
}
