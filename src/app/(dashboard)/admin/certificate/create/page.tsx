import ActivityTemplateManager from "../../_components/form/certificado/activity-types/activity-template-manager";
import SelectActivityType from "../../_components/form/certificado/activity-types/select-activity-type";
import ParticipantTemplateManager from "../../_components/form/certificado/participant-types/participant-template-manager";
import SelectParticipantTypes from "../../_components/form/certificado/participant-types/select-participant-types";
import RoleTemplateManager from "../../_components/form/certificado/role/role-template-manager";
import SelectRole from "../../_components/form/certificado/role/select-role";
import SelectTemplateLocation from "../../_components/form/certificado/select-template-location";
import SubmitButton from "../../_components/form/certificado/submit-button";
import CreateCertificateForm from "../../_components/form/create-certificate-form";

export default function CreateCertificatePage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Crear certificado</h1>
      <CreateCertificateForm>
        <SelectTemplateLocation />
        <SelectRole />
        <SelectActivityType />
        <SelectParticipantTypes />
        <h2 className="text-xl font-bold">Plantillas</h2>
        <RoleTemplateManager />
        <ParticipantTemplateManager />
        <ActivityTemplateManager />
        <SubmitButton />
      </CreateCertificateForm>
    </>
  );
}
