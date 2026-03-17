import { Trash, X } from "lucide-react";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function DeleteActionButton({
  onClick,
  description,
}: {
  onClick: () => Promise<void>;
  description: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const onDelete = () => {
    startTransition(async () => {
      await onClick();
      setOpen(false);
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="group flex items-center justify-center transition-all duration-300 ease-in-out hover:gap-2 gap-0 px-3 hover:px-4 "
          variant="destructive"
        >
          <Trash className="h-4 w-4 shrink" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[150px] group-hover:opacity-100">
            Eliminar
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de que quieres continuar?
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <X className="mr-2" />
            Cancelar
          </AlertDialogCancel>
          <Button variant="destructive" onClick={onDelete} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="mr-2" /> Eliminando
              </>
            ) : (
              <>
                <Trash className="mr-2" />
                Eliminar
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
