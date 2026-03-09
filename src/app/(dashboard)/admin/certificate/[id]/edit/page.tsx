import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Certificate } from "@/lib/types/certificate";
import ActivityTemplateManager from "../../../_components/form/certificado/activity-types/activity-template-manager";
import SelectActivityType from "../../../_components/form/certificado/activity-types/select-activity-type";
import ParticipantTemplateManager from "../../../_components/form/certificado/participant-types/participant-template-manager";
import SelectParticipantTypes from "../../../_components/form/certificado/participant-types/select-participant-types";
import RoleTemplateManager from "../../../_components/form/certificado/role/role-template-manager";
import SelectRole from "../../../_components/form/certificado/role/select-role";
import SelectTemplateLocation from "../../../_components/form/certificado/select-template-location";
import EditCertificateForm from "../../../_components/form/edit-certificate-form";
import { findCertificateById } from "../actions";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { isSuccess, value, error } = await findCertificateById(id);
  if (!isSuccess) {
    return error;
  }
  return <EditCertificatePageContent certificate={value} />;
}

function EditCertificatePageContent({
  certificate,
}: {
  certificate: Certificate;
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <h1 className="text-6xl">Edición de certificado</h1>
      <section className="flex flex-1 justify-between">
        <Button variant="link" asChild>
          <Link href={`/admin/certificate/${certificate.id}`} prefetch>
            <ChevronLeft />
            Cancelar
          </Link>
        </Button>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Editar certficado {certificate.name}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <EditCertificateForm data={certificate}>
            <SelectTemplateLocation />
            <SelectRole />
            <SelectActivityType />
            <SelectParticipantTypes />
            <h4 className="text-lg font-semibold">Plantillas</h4>
            <RoleTemplateManager />
            <ActivityTemplateManager />
            <ParticipantTemplateManager />
          </EditCertificateForm>
        </CardContent>
        <CardFooter className="justify-end gap-4">
          <Button variant="outline">Restaurar</Button>
          <Button type="submit" form="form-edit-certificate">
            Guardar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
