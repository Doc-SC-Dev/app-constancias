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
  return (
    <div className="container mx-auto space-y-4">
      <h3 className="text-2xl font-bold">Actividades</h3>

      <div className="flex items-center justify-between">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="loading-filter">Filtrar</Label>
          <Input
            id="loading-filter"
            className="max-w-sm"
            placeholder="Filtrar datos en columnas"
            disabled
          />
        </div>
        <Button disabled>
          Crear Actividad
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="flex w-full gap-4">
              <TableHead className="flex-1 flex items-center">Nombre</TableHead>
              <TableHead className="flex-1 flex items-center">Tipo</TableHead>
              <TableHead className="flex-1 flex items-center justify-center">
                Fechas
              </TableHead>
              <TableHead className="flex-1 flex items-center justify-center">
                Cantidad de participantes
              </TableHead>
              <TableHead className="flex-1 flex items-center justify-center">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <TableRow key={`loading-row-${i}`} className="flex w-full gap-4">
                <TableCell className="flex-1 flex items-center">
                  <Skeleton className="h-4 w-full bg-muted" />
                </TableCell>
                <TableCell className="flex-1 flex items-center">
                  <Skeleton className="h-4 w-full bg-muted" />
                </TableCell>
                <TableCell className="flex-1 flex items-center justify-center">
                  <Skeleton className="h-4 w-24 bg-muted" />
                </TableCell>
                <TableCell className="flex-1 flex items-center justify-center">
                  <Skeleton className="h-4 w-12 bg-muted" />
                </TableCell>
                <TableCell className="flex-1 flex items-center justify-center">
                  <Skeleton className="h-4 w-8 bg-muted" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
