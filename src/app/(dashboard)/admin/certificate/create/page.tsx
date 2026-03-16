import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityTemplateManager from "../../_components/form/certificado/activity-types/activity-template-manager";
import SelectActivityType from "../../_components/form/certificado/activity-types/select-activity-type";
import ParticipantTemplateManager from "../../_components/form/certificado/participant-types/participant-template-manager";
import SelectParticipantTypes from "../../_components/form/certificado/participant-types/select-participant-types";
import RoleTemplateManager from "../../_components/form/certificado/role/role-template-manager";
import SelectRole from "../../_components/form/certificado/role/select-role";
import SelectTemplateLocation from "../../_components/form/certificado/select-template-location";
import CreateCertificateForm from "../../_components/form/create-certificate-form";

export default function CreateCertificatePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-4xl font-bold">Crear certificado</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CreateCertificateForm>
          <SelectTemplateLocation />
          <SelectRole />
          <SelectActivityType />
          <SelectParticipantTypes />
          <h2 className="text-xl font-semibold">Plantillas</h2>
          <RoleTemplateManager />
          <ParticipantTemplateManager />
          <ActivityTemplateManager />
        </CreateCertificateForm>
      </CardContent>
    </Card>
  );
}
