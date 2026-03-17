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

export default function Loading() {
  const headers = [
    "Tipo de Solicitud",
    "Nombre de Usuario",
    "Rol",
    "Fecha de Creación",
    "Estado",
    "Acción",
  ];

  const row = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="container mx-auto flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Solicitudes</h2>
      </div>

      <div className="h-full flex flex-col">
        {/* Visual mock of tabs */}
        <div className="w-fit inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all bg-background text-foreground shadow">
            Solicitudes
          </div>
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all">
            Solicitudes Especiales
          </div>
        </div>

        {/* Static Controls for Loading State */}
        <div className="flex items-center py-4 align-middle justify-between">
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

        <div className="overflow-hidden rounded-md border">
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
              {row.map((i) => (
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
    </div>
  );
}
