import { ArrowLeftIcon, MailIcon } from "lucide-react";
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

export default function UserLoading() {
  const peticionesHeaders = ["Nombre", "Estado", "Fecha de emisión"];
  const actividadesHeaders = ["Nombre", "Tipo de Actividad", "Horas", "Participación"];

  return (
    <Card>
      <CardHeader className="justify-start">
        <Button
          variant="link"
          disabled
          className="flex flex-row items-center space-x-2 w-max justify-start px-0"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <p>Volver</p>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="container flex flex-1 items-center justify-between mx-auto">
          <div className="flex gap-10">
            <Skeleton className="h-16 w-16 rounded-full bg-gray-300" />

            <div className="flex flex-col gap-3 justify-center">
              <span className="flex items-center space-x-10">
                <Skeleton className="h-10 w-[400px] bg-gray-300" />
                <Skeleton className="h-6 w-24 rounded-full bg-gray-300" />
              </span>

              <span className="flex items-center space-x-3">
                <MailIcon className="w-4 h-4 text-muted-foreground" />
                <Skeleton className="h-4 w-64 bg-gray-300" />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-md font-medium">Estado</p>
            <Skeleton className="h-8 w-[88px] rounded-md bg-gray-300" />
          </div>
        </div>

        <div className="flex flex-col container mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-left">Peticiones</h3>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {peticionesHeaders.map((header) => {
                    return <TableHead key={header}>{header}</TableHead>;
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...new Array(3).fill(null).map((_, i) => i + 1)].map((row) => (
                  <TableRow key={`loading-peticiones-${row}`}>
                    {peticionesHeaders.map((cell) => (
                      <TableCell key={`tc-peticiones-${cell}-${row}`}>
                        <Skeleton className="h-4 bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex flex-col container mx-auto mt-4">
          <h3 className="text-lg font-semibold mb-4 text-left">Actividades</h3>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {actividadesHeaders.map((header) => {
                    return <TableHead key={header}>{header}</TableHead>;
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...new Array(3).fill(null).map((_, i) => i + 1)].map((row) => (
                  <TableRow key={`loading-actividades-${row}`}>
                    {actividadesHeaders.map((cell) => (
                      <TableCell key={`tc-actividades-${cell}-${row}`}>
                        <Skeleton className="h-4 bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
