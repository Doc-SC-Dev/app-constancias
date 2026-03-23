import { ArrowLeft, Edit, Trash } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Certificate } from "@/lib/types/certificate";
import { formatDate, Textos } from "@/lib/utils";
import DeleteCertificateAlertDialog from "./_components/delete-certificate-alert-dialog";
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
      <section
        id={`section-action-button-${certificate.id}`}
        className="w-full flex justify-between gap mb-4"
      >
        <Button variant="ghost" asChild>
          <Link href="/admin/certificate">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="flex gap-4">
          <Button variant="link" asChild>
            <Link href={`/admin/certificate/${certificate.id}/edit`}>
              <Edit />
              Editar
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <DeleteCertificateAlertDialog certificate={certificate} />
          </AlertDialog>
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-4xl font-bold">{certificate.name}</h2>
          </CardTitle>
          <CardDescription>
            <div className="flex gap-4 items-center">
              <p className="text-md">Fecha de creación:</p>
              <p className="text-md font-semibold">
                {formatDate(certificate.createdAt)}
              </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <section id="template-section" className="space-y-4">
            <h3 className="text-2xl font-semibold">Plantillas</h3>
            {certificate.variant === "role" && (
              <>
                <h3 className="text-xl font-semibold">Roles</h3>
                <Accordion type="single" collapsible>
                  {certificate.template.map((temp) => (
                    <AccordionItem
                      value={`accordion-item-role-${temp.id}`}
                      key={`accordion-item-${temp.id}`}
                    >
                      <AccordionTrigger>
                        {Textos.Role[temp.role]}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>{temp.template}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}

            {certificate.variant === "activity" && (
              <>
                <h3 className="text-xl font-semibold">Tipos de actividad</h3>
                <Accordion type="single" collapsible>
                  {certificate.template.map((temp) => (
                    <AccordionItem
                      value={`accordion-item-activity-${temp.id}`}
                      key={`accordion-item-${temp.id}`}
                    >
                      <AccordionTrigger>
                        {temp.activityType.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>{temp.template}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
            {certificate.variant === "participant" && (
              <>
                <h3 className="text-xl font-semibold">Tipos de participante</h3>
                <Accordion type="single" collapsible>
                  {certificate.template.map((temp) => (
                    <AccordionItem
                      value={`accordion-item-participant-${temp.id}`}
                      key={`accordion-item-participant-${temp.id} `}
                    >
                      <AccordionTrigger>
                        {`${temp.participantType.name} (${temp.participantType.activityType.name})`}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>{temp.template}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
          </section>
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
