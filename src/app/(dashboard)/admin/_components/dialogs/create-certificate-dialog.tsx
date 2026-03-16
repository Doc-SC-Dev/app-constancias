import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCertificateForm from "../form/create-certificate-form";

export default function CreateCertificateDialog() {
  return (
    <Button asChild>
      <Link href="/admin/certificate/create">
        <Plus />
        Crear Certificado
      </Link>
    </Button>
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <Button>
    //       <Plus />
    //       Crear Certificado
    //     </Button>
    //   </DialogTrigger>
    //   <DialogContent>
    //     <DialogTitle>Crear nuevo certificado</DialogTitle>
    //     <DialogDescription>
    //       Ingresa los datos que se requieren para crear un nuevo certificado
    //     </DialogDescription>
    //     <CreateCertificateForm>{""}</CreateCertificateForm>
    //   </DialogContent>
    // </Dialog>
  );
}
