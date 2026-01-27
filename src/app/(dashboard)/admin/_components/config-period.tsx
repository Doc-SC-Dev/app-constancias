import { CircleX, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AcademicPeriod } from "@/generated/prisma";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function ConfigPeriod() {
  const period = await db.academicPeriod.findFirst({
    where: {
      active: true,
    },
  });

  if (!period) {
    return <ConfigPeriodError />;
  }
  return <ConfigPeriodContent period={period} />;
}

function ConfigPeriodContent({ period }: { period: AcademicPeriod }) {
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-4 gap-10 items-center">
        <h3 className="text-6xl">{period.name}</h3>
        <div className="flex flex-col gap-4 justify-center">
          <Badge
            className="text-sm bg-teal-50 text-teal-700 ring-teal-600/20"
            variant="outline"
          >
            <strong>Inicio Solicitudes:</strong> {formatDate(period.startDate)}
          </Badge>
          <Badge
            className="text-sm bg-rose-50 text-rose-700 ring-rose-600/20"
            variant="outline"
          >
            <strong>Cierre Solicitudes:</strong>
            {formatDate(period.endDate)}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 justify-start">
        <Button variant="destructive" size="lg">
          <CircleX />
          Cerrar periodo
        </Button>
      </div>
    </div>
  );
}

function ConfigPeriodError() {
  return (
    <Alert variant="default">
      <Info />
      <AlertTitle>Periodos academicos unactivos</AlertTitle>
      <AlertDescription>
        No existe un periodo academico que este activo
      </AlertDescription>
    </Alert>
  );
}
export function ConfigPeriodLoading() {
  return (
    <div className="flex flex-col w-1/4 gap-4">
      <Skeleton className="w-full h-6 bg-gray-300" />
      <div className="flex gap-4">
        <Skeleton className="w-1/2 h-4 bg-gray-300" />
        <Skeleton className="w-1/2 h-4 bg-gray-300" />
      </div>
    </div>
  );
}
