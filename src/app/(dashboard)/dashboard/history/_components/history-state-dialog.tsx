"use client";

import { type } from "arktype";

import { useTransition } from "react";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HistoryEntry } from "@/lib/types/history";
import { toast } from "sonner";
import { updateRequestState } from "../actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Certificates } from "@/lib/types/request";
import { Input } from "@/components/ui/input";

type DialogContentProps = {
  data: HistoryEntry;
  closeDialog: () => void;
};

const urlSchema = type("string.url");

export default function HistoryStateDialog({
  data: request,
  closeDialog,
}: DialogContentProps) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [currentState, setCurrentState] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    request.state === "PENDING" ? "APPROVED" : (request.state as "PENDING" | "APPROVED" | "REJECTED")
  );
  const [link, setLink] = useState(request.link || "");

  const handleUpdate = async () => {
    if (currentState === "APPROVED") {
      const out = urlSchema(link);
      if (out instanceof type.errors) {
        toast.error("Debe agregar un link válido de descarga");
        return;
      }
    }

    setLoading(true);
    try {
      const { success, message } = await updateRequestState(request.id, currentState, link);

      if (success) {
        toast.success("Estado actualizado exitosamente");
        startTransition(() => {
          router.refresh();
          closeDialog();
        });
      } else {
        toast.error(message || "Error al actualizar el estado");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-md flex flex-col">
      <DialogHeader>
        <DialogTitle>Editar Estado de Solicitud</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm text-muted-foreground">Tipo de Constancia</span>
              <span>{request.certName}</span>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="state-select" className="text-muted-foreground">Estado</Label>
              <Select
                value={currentState}
                onValueChange={(val) => setCurrentState(val as "PENDING" | "APPROVED" | "REJECTED")}
              >
                <SelectTrigger id="state-select">
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>

                  <SelectItem value="APPROVED">Aprobada</SelectItem>
                  <SelectItem value="REJECTED">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="link-input" className="text-muted-foreground">Link de Descarga</Label>
            <Input
              id="link-input"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://ejemplo.com/archivo.pdf"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="sm:justify-end gap-2">
        <Button variant="outline" onClick={closeDialog} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleUpdate} disabled={loading || isPending}>
          {loading || isPending ? <Spinner className="mr-2 size-4" /> : null}
          Guardar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
