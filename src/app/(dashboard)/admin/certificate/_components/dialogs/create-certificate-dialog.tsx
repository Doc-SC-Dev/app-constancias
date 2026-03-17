import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateCertificateDialog() {
  return (
    <Button asChild>
      <Link href="/admin/certificate/create">
        <Plus />
        Crear Certificado
      </Link>
    </Button>
  );
}
