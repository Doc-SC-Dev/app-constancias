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
  const headers = ["Estado", "Matrícula", "Nombre", "Email", "Año de admisión"];

  const row = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="container h-full mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Estudiantes</h2>
      <div className="flex items-center justify-between">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="loading-filter">Filtrar</Label>
          <Input
            id="loading-filter"
            className="max-w-sm"
            placeholder="Filtrar por matrícula, nombre o email"
            disabled
          />
        </div>
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
                    <Skeleton className="h-4 w-full bg-muted" />
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
