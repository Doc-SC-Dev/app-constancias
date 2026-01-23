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
import { Textos } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const [currentState, setCurrentState] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    request.state === "PENDING" ? "APPROVED" : (request.state as "PENDING" | "APPROVED" | "REJECTED")
  );
  const [link, setLink] = useState(request.link || "");
  const [rejectionReason, setRejectionReason] = useState(request.rejectionReason || "");

  const handleUpdate = async () => {
    if (currentState === "APPROVED") {
      const out = urlSchema(link);
      if (out instanceof type.errors) {
        toast.error("Debe agregar un link válido de descarga");
        return;
      }
    }

    if (currentState === "REJECTED" && !rejectionReason.trim()) {
      toast.error("Debe agregar un motivo para el rechazo");
      return;
    }

    setLoading(true);
    try {
      const { success, message } = await updateRequestState(
        request.id,
        currentState,
        currentState === "APPROVED" ? link : undefined,
        currentState === "REJECTED" ? rejectionReason : undefined
      );

      if (success) {
        toast.success("Estado actualizado exitosamente");
        await queryClient.invalidateQueries({ queryKey: ["list-history-standard"] });
        await queryClient.invalidateQueries({ queryKey: ["list-history-other"] });
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
                  <SelectItem value="APPROVED">
                    {Textos.State.APPROVED}
                  </SelectItem>
                  {request.certName === Certificates.OTHER && (
                    <>
                      <SelectItem value="PENDING">
                        {Textos.State.PENDING}
                      </SelectItem>
                      <SelectItem value="REJECTED">
                        {Textos.State.REJECTED}
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentState === "APPROVED" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="link-input" className="text-muted-foreground">Link de Descarga</Label>
              <Input
                id="link-input"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://ejemplo.com/archivo.pdf"
              />
            </div>
          )}

          {currentState === "REJECTED" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="rejection-reason" className="text-muted-foreground">Motivo del Rechazo</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Indique el motivo del rechazo..."
              />
            </div>
          )}
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
