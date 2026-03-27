import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function HistoryTableSkeleton() {
  const headers = [
    "Tipo de Solicitud",
    "Nombre de Usuario",
    "Rol",
    "Fecha de Creación",
    "Estado",
    "Acción",
  ];

  const rows = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center pb-4 align-middle justify-between">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="loading-filter">Filtrar</Label>
          <Input
            id="loading-filter"
            className="max-w-sm"
            placeholder="Filtrar por Nombre, Rol, RUT y Solicitud"
            disabled
          />
        </div>
        <Button disabled>
          Crear Solicitud
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border h-full">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="text-center">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((i) => (
              <TableRow key={`loading-row-${i}`}>
                {headers.map((cell) => (
                  <TableCell key={`tc-s-${cell}-${i}`}>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-24 bg-muted" />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
