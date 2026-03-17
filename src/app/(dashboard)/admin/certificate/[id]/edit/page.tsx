import {
  Card,
  CardContent,
  CardDescription,
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
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-4xl font-bold">
            Editar certificado {certificate.name}
          </h1>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <EditCertificateForm data={certificate}>
          <SelectTemplateLocation />
          <SelectRole />
          <SelectActivityType />
          <SelectParticipantTypes />
          <h4 className="text-xl font-semibold">Plantillas</h4>
          <RoleTemplateManager />
          <ActivityTemplateManager />
          <ParticipantTemplateManager />
        </EditCertificateForm>
      </CardContent>
    </Card>
  );
}
