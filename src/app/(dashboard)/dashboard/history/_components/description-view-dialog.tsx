"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HistoryEntry } from "@/lib/types/history";
import { Button } from "@/components/ui/button";

type DialogContentProps = {
  data: HistoryEntry;
  closeDialog: () => void;
};

export default function DescriptionViewDialog({
  data: request,
  closeDialog,
}: DialogContentProps) {
  return (
    <DialogContent className="max-w-md flex flex-col">
      <DialogHeader>
        <DialogTitle>Detalle de Solicitud</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm text-muted-foreground">Tipo de Constancia</span>
          <span>{request.certName}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm text-muted-foreground">Descripción</span>
          <span>
            {request.description || "No se ha especificado una descripción."}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={closeDialog}>
          Cerrar
        </Button>
      </div>
    </DialogContent>
  );
}
