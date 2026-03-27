"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DeleteAlertDialog from "@/components/delete-alert-dialog";
import type { Certificate } from "@/lib/types/certificate";
import { deleteCertificate } from "../actions";

export default function DeleteCertificateAlertDialog({
  certificate,
}: {
  certificate: Pick<Certificate, "id" | "name">;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const { isSuccess, value, error } = await deleteCertificate(certificate.id);
    if (!isSuccess) {
      toast.error("Error al eliminar certificado", {
        description: error,
      });
      return;
    }
    toast.success("Certificado eliminado exitosamente", {
      description: `Certificado ${value.name} eliminado exitosamente`,
    });
    queryClient.invalidateQueries({
      queryKey: ["get-paginated-certificates"],
    });

    router.replace("/admin/certificate");
  };
  return (
    <DeleteAlertDialog
      description={`Estás a punto de realizar una operación irreversible, ¿estás seguro de que quieres continuar?.\n Vas a eliminar el certificado ${certificate.name} y todas sus plantillas asociadas`}
      onAccept={handleDelete}
    />
  );
}
