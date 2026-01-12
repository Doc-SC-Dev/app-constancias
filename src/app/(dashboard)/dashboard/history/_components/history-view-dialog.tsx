import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HistoryEntry } from "@/lib/types/history";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { downloadCertificate } from "@/app/(dashboard)/action";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

type DialogContentProps = {
  data: HistoryEntry;
  certName?: string;
};

export default function ViewDialog({
  data: user,
  certName,
}: DialogContentProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { success, data, message } = await downloadCertificate(user.id);

      if (success && data) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${data}`;
        const date = new Date(user.createdAt)
          .toLocaleDateString("es-CL")
          .replace(/\//g, "-");
        link.download = `${certName || "constancia"}-${date}.pdf`;
        link.click();
        toast.success("Certificado descargado exitosamente");
      } else {
        toast.error(message || "Error al descargar el certificado");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado al descargar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl flex flex-col">
      <DialogHeader>
        {/* ------------------------------------------------------------------- */}
        <DialogTitle className="flex items-center justify-between">
          Detalle de Constancia
          <span className="bg-green-100 text-green-800 text-base font-normal px-2.5 py-0.5 rounded border border-green-400">
            Aprovada
          </span>
        </DialogTitle>
        {/* ------------------------------------------------------------------- */}
      </DialogHeader>
      <div className="flex flex-col gap-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm text-muted-foreground">
              Tipo de Constancia
            </span>
            <span className="text-sm">{user.certName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm text-muted-foreground">
              Fecha de emisión
            </span>
            <span className="text-sm">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <DialogFooter className="sm:justify-center">
        <Button
          className="min-w-32"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner className="mr-2 size-4" />
              Descargando...
            </>
          ) : (
            <>
              Descargar
              <Download className="ml-2 size-4" />
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
