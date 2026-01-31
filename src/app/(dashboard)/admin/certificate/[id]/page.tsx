import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Certificate } from "@/lib/types/certificate";
import { formatDate, Textos } from "@/lib/utils";
import CertificateBodyField from "../../_components/form/certificate-body-field";
import { findCertificateById } from "./actions";

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { error, value, isSuccess } = await findCertificateById(id);
  if (!isSuccess) {
    return error;
  }
  return <CertificateDetailPageContent certificate={value} />;
}

const CertificateDetailPageContent = ({
  certificate,
}: {
  certificate: Certificate;
}) => {
  return (
    <div className="container mx-auto">
      <Button variant="ghost" asChild>
        <Link href="/admin?tab=certificates">
          <ArrowLeft />
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-4xl font-bold">{certificate.name}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <p className="text-md">Fecha de creación:</p>
            <p className="text-md font-semibold">
              {formatDate(certificate.createdAt)}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <p className="text-md">Roles permitidos</p>
            {certificate.roles.map((rol) => (
              <Badge variant="outline" key={rol}>
                {Textos.Role[rol]}
              </Badge>
            ))}
          </div>

          <section id="template-section" className="space-y-4">
            <h3 className="text-xl font-semibold">Template</h3>
            <CertificateBodyField
              initial={certificate.template}
              canEdit={false}
            />
          </section>
          {certificate.activityType.length > 0 && (
            <section
              id="activity-type-section"
              className=" flex flex-col gap-4"
            >
              <h3 className="text-xl font-semibold">Tipos de actividades</h3>
              <div className="flex gap-4">
                {certificate.activityType.map((act) => (
                  <Badge variant="secondary" key={act.id}>
                    {act.name}
                  </Badge>
                ))}
              </div>
            </section>
          )}
          {certificate.participantType.length > 0 && (
            <section
              id="participant-type-section"
              className="flex flex-col gap-4"
            >
              <h3 className="text-xl font-semibold">Tipos de participantes</h3>
              <div className="flex gap-4">
                {certificate.participantType.map((part) => (
                  <Badge variant="secondary" key={part.id}>
                    {part.name}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const LoadingCertificateDetailPage = () => {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-2/3 bg-gray-300" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-5 w-1/4 bg-gray-300" />
            <Skeleton className="h-5 w-3/5 bg-gray-300" />
          </div>
          <div className="flex gap-4 items-center ">
            <Skeleton className="h-5 w-1/4 bg-gray-300" />
            <Skeleton className="h-5 w-3/5 bg-gray-300" />
          </div>
          <section className="space-y-4">
            <Skeleton className="h-5 w-1/4 bg-gray-300" />
            <Skeleton className="h-20 w-3/4 bg-gray-300" />
          </section>
          <section className="flex flex-col gap-4 justify-center">
            <Skeleton className="h-5 w-1/4 bg-gray-300" />
            <Skeleton className="h-5 w-3/5 bg-gray-300" />
          </section>
          <section className=" flex flex-col gap-4 justify-center">
            <Skeleton className="h-5 w-1/4 bg-gray-300" />
            <Skeleton className="h-5 w-3/5 bg-gray-300" />
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
