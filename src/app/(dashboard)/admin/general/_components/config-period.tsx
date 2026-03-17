import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { AcademicPeriod } from "@/generated/prisma";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ClosePeriodDialog } from "./dialogs/close-period-dialog";

export default async function ConfigPeriod() {
  const periodsDesc = await db.academicPeriod.findMany({
    orderBy: { startDate: "desc" },
    take: 2,
  });

  if (!periodsDesc || periodsDesc.length === 0) {
    return <ConfigPeriodError />;
  }

  const periods = periodsDesc.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );

  return <ConfigPeriodContent periods={periods} />;
}

function ConfigPeriodContent({ periods }: { periods: AcademicPeriod[] }) {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex-4 flex-col gap-8 w-full">
        {periods.map((period, index) => (
          <div key={period.id} className="flex flex-col gap-2">
            <h4 className="text-xl font-semibold text-muted-foreground">
              {index === 0 ? "Primer Periodo" : "Segundo Periodo"}
            </h4>
            <div className="flex flex-4 gap-10 items-center">
              <h3 className="text-6xl">{period.name}</h3>
              <div className="flex flex-col gap-4 justify-center">
                <Badge
                  className="text-sm bg-teal-50 text-teal-700 ring-teal-600/20"
                  variant="outline"
                >
                  <strong>Inicio Solicitudes:</strong>{" "}
                  {formatDate(period.startDate)}
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
          </div>
        ))}
      </div>
      <div className="flex flex-1 justify-items-start items-center my-auto">
        <ClosePeriodDialog periods={periods} />
      </div>
    </div>
  );
}

function ConfigPeriodError() {
  return (
    <Alert variant="default">
      <Info />
      <AlertTitle>Períodos académicos inactivos</AlertTitle>
      <AlertDescription>
        No existe un período académico que esté activo
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
