"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HistoryEntry } from "@/lib/types/history";

type DialogContentProps = {
  data: HistoryEntry;
  closeDialog: () => void;
};

export default function HistoryViewDialog({
  data: request,
  closeDialog,
}: DialogContentProps) {
  return (
    <DialogContent className="max-w-md flex flex-col">
      <DialogHeader>
        <DialogTitle>Motivo de Rechazo</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm text-muted-foreground">
            Tipo de Constancia
          </span>
          <span>{request.certName}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm text-muted-foreground">
            Motivo
          </span>
          <p className="text-sm text-foreground bg-gray-50 p-3 rounded-md border">
            {request.rejectionReason || "No se ha especificado un motivo."}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={closeDialog}>Cerrar</Button>
      </div>
    </DialogContent>
  );
}
