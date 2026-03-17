"use client";
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
  const handleDelete = () => {
    toast.promise(deleteCertificate(certificate.id), {
      loading: "Eliminando certificado...",
      success: ({ error, value, isSuccess }) => {
        if (isSuccess) {
          router.replace("/admin/certificate");
          return {
            message: "Certificado eliminado exitosamente",
            description: `Certificado ${value.name} eliminado exitosamente`,
          };
        }
        return {
          message: "Error al eliminar certificado",
          description: error,
          type: "error",
        };
      },
      error: (error) => error,
    });
  };
  return (
    <DeleteAlertDialog
      description={`Estas apunto de realizar una operación irreversible, ¿estás seguro de que quieres continuar?.\n Vas a eliminar el certificado ${certificate.name} y todas sus plantillas asociadas`}
      onAccept={handleDelete}
    />
  );
}
