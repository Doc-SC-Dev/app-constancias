import { ArrowLeftIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ActivityLoading() {
  const participantsHeaders = ["Nombre", "Rol", "Horas"];

  return (
    <Card className="h-full w-full">
      <CardHeader className="flex items-center justify-between">
        <Button variant="link" size="icon-sm" disabled>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          <Button variant="link" disabled>
            <span>
              <Edit className="inline-block mr-2 h-4 w-4" />
              Editar
            </span>
          </Button>
          <Button variant="destructive" disabled>
            Eliminar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-7 w-64 bg-gray-300" />
          <div className="flex items-center gap-4">
            <span className="font-medium text-sm text-muted-foreground">
              Tipo
            </span>
            <Skeleton className="h-6 w-24 rounded-full bg-gray-300" />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-sm text-muted-foreground">
              Periodo
            </span>
            <Skeleton className="h-5 w-48 bg-gray-300" />
          </div>
        </div>

        <div className="space-y-3 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-muted-foreground shrink-0">
              Participantes
            </span>
            <Skeleton className="h-4 w-8 bg-gray-300" />
          </div>
          <div className="flex-1 overflow-auto">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {participantsHeaders.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...new Array(3).fill(null).map((_, i) => i + 1)].map(
                    (row) => (
                      <TableRow key={`loading-participants-${row}`}>
                        {participantsHeaders.map((cell) => (
                          <TableCell key={`tc-p-${cell}-${row}`}>
                            <Skeleton className="h-4 bg-muted" />
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
