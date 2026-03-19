import { Info, CalendarRange } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AcademicPeriod } from "@/generated/prisma";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ClosePeriodDialog } from "./close-period-dialog";

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

const periodStyles = [
  {
    border: "border-l-4 border-l-teal-500",
    icon: "text-teal-600",
    label: "Primer Periodo",
    namColor: "text-teal-700",
  },
  {
    border: "border-l-4 border-l-indigo-500",
    icon: "text-indigo-600",
    label: "Segundo Periodo",
    namColor: "text-indigo-700",
  },
];

function ConfigPeriodContent({ periods }: { periods: AcademicPeriod[] }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full gap-4">
        {periods.map((period, index) => {
          const style = periodStyles[index];
          return (
            <Card
              key={period.id}
              className={`flex-1 shadow-sm ${style.border}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarRange className={`h-4 w-4 ${style.icon}`} />
                  {style.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <span className={`text-5xl font-bold tracking-tight ${style.namColor}`}>
                  {period.name}
                </span>
                <div className="flex flex-col gap-2">
                  <Badge
                    className="text-sm bg-teal-50 text-teal-700 ring-teal-600/20"
                    variant="outline"
                  >
                    <strong>Inicio de Periodo:</strong>{" "}
                    {formatDate(period.startDate)}
                  </Badge>
                  <Badge
                    className="text-sm bg-rose-50 text-rose-700 ring-rose-600/20"
                    variant="outline"
                  >
                    <strong>Cierre de Periodo:</strong>{" "}
                    {formatDate(period.endDate)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-end">
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
