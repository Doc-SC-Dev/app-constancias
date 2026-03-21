import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateCertificateDialog() {
  return (
    <Button asChild>
      <Link href="/admin/certificate/create">
        <Plus className="h-4 w-4 mr-2" />
        Agregar
      </Link>
    </Button>
  );
}
