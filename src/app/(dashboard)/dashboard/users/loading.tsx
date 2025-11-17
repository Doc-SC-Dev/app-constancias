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

export default function UsersLoading() {
  const headers = [
    "Estado",
    "Nombre",
    "Role",
    "Email",
    "Matricula",
    "Acciones",
  ];
  return (
    <>
      <div className="flex items-center py-4 align-middle justify-between">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="fuzzy-input">Filtrar</Label>
          <Input
            id="fuzzy-input"
            className="max-w-sm"
            placeholder="Filtrar por nombre, email, rut, matricula o rol"
          />
        </div>
        <Button>
          <Plus />
          Crear usuario
        </Button>
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
    </>
  );
}
