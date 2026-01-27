import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import AdminTabs from "./_components/admin-tabs";
import ConfigActivityType from "./_components/config-activity-type";
import ConfigCertificates from "./_components/config-certificates";
import ConfigGeneral from "./_components/config-general";
import ConfigGrades from "./_components/config-grades";

export default async function AdminPage() {
  const { user } = await isAuthenticated();
  if (!isAdmin(user.role as Role)) redirect("/dashboard");

  const DASHBOARD_TABS = [
    {
      value: "general",
      label: "General",
      component: <ConfigGeneral />,
    },
    {
      value: "grades",
      label: "Grados Academicos",
      component: <ConfigGrades />,
    },
    {
      value: "activityTypes",
      label: "Tipos de actividades",
      component: <ConfigActivityType />,
    },
    {
      value: "certificates",
      label: "Certificados",
      component: <ConfigCertificates />,
    },
  ] as const;
  return (
    <div className="container mx-auto h-full space-y-4">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      <AdminTabs tabs={DASHBOARD_TABS} />
    </div>
  );
}
