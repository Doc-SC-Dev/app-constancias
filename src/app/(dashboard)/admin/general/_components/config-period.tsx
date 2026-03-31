import { Info, CalendarRange } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    return (
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl">Periodos Académicos</h1>
        <ConfigPeriodError />
      </div>
    );
  }

  const periods = periodsDesc.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl">Periodos Académicos</h1>
        <ClosePeriodDialog periods={periods} />
      </div>
      <ConfigPeriodContent periods={periods} />
    </div>
  );
}

const periodStyles = [
  {
    wrapper: "border-l-4 border-l-primary bg-gradient-to-br from-white to-primary/5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 dark:from-slate-950 dark:to-primary/10",
    iconWrapper: "p-2 bg-primary/10 text-primary rounded-lg dark:bg-primary/20",
    icon: "text-primary",
    label: "Primer Periodo",
    namColor: "bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent drop-shadow-sm",
    badgeStart: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30",
    badgeEnd: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800",
  },
  {
    wrapper: "border-l-4 border-l-primary bg-gradient-to-br from-white to-primary/5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 dark:from-slate-950 dark:to-primary/10",
    iconWrapper: "p-2 bg-primary/10 text-primary rounded-lg dark:bg-primary/20",
    icon: "text-primary",
    label: "Segundo Periodo",
    namColor: "bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent drop-shadow-sm",
    badgeStart: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30",
    badgeEnd: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800",
  },
];

function ConfigPeriodContent({ periods }: { periods: AcademicPeriod[] }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {periods.map((period, index) => {
          const style = periodStyles[index] || periodStyles[0];
          return (
            <Card
              key={period.id}
              className={`flex-1 shadow-sm ${style.wrapper}`}
            >
              <CardHeader className="pb-2 flex flex-row items-center gap-3 space-y-0 relative">
                <div className={style.iconWrapper}>
                  <CalendarRange className="h-5 w-5" />
                </div>
                <CardTitle className="flex flex-1 items-center justify-between text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  <span>{style.label}</span>
                  {period.active && (
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/5 text-primary hover:bg-primary/10 dark:bg-primary/20 dark:text-primary border border-primary/20 shadow-sm px-2 py-0.5"
                    >
                      <span className="mr-1.5 flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse hidden sm:inline-flex"></span>
                      Actual
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6 pt-2">
                <div className="flex flex-col items-center justify-center min-w-[120px]">
                  <span className={`text-5xl font-extrabold tracking-tighter ${style.namColor}`}>
                    {period.name}
                  </span>
                </div>
                
                <div className="flex flex-col gap-3 flex-1 border-l pl-6 border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Inicio de Periodo
                    </span>
                    <Badge
                      className={`w-fit px-3 py-1 font-semibold text-xs ${style.badgeStart}`}
                      variant="outline"
                    >
                      {formatDate(period.startDate)}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Cierre de Periodo
                    </span>
                    <Badge
                      className={`w-fit px-3 py-1 font-semibold text-xs ${style.badgeEnd}`}
                      variant="outline"
                    >
                      {formatDate(period.endDate)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ConfigPeriodError() {
  return (
    <Alert variant="default">
      <Info />
      <AlertTitle>Periodos académicos inactivos</AlertTitle>
      <AlertDescription>
        No existe un periodo académico que esté activo
      </AlertDescription>
    </Alert>
  );
}
export function ConfigPeriodLoading() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl">Periodos Académicos</h1>
      <div className="flex flex-col w-1/4 gap-4">
        <Skeleton className="w-full h-6 bg-gray-300" />
        <div className="flex gap-4">
          <Skeleton className="w-1/2 h-4 bg-gray-300" />
          <Skeleton className="w-1/2 h-4 bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
