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

export default function ExamsLoading() {
  const headers = [
    "Actividades",
    "Tipo de Actividad",
    "Profesor a Cargo",
    "Fecha",
    "Estado",
    "Acciones",
  ];
  return (
    <div className="container h-full mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Exámenes</h2>
      <div className="flex items-center justify-between">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="fuzzy-input">Filtrar</Label>
          <Input
            id="fuzzy-input"
            className="max-w-sm"
            placeholder="Filtrar por actividad, tipo de activiad y profesor a cargo"
            disabled
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => {
                return <TableHead key={header}>{header}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...new Array(10).fill(null).map((_, i) => i + 1)].map((row) => (
              <TableRow key={`loading-row-${row}`}>
                {headers.map((cell) => (
                  <TableCell key={`tc-s-${cell}-${row}`}>
                    <Skeleton className="h-4 bg-muted" />
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
