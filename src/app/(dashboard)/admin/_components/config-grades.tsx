"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableCell } from "@/components/table-cell";
import { formatDate } from "@/lib/utils";
import { getPaginatedAcademicDegree } from "../actions";
import CreateGradeDialog from "./create-grade-dialog";

export type AcademicDegreeDto = {
  id: string;
  name: string;
  abbrevFem: string;
  abbrevMas: string;
  createdAt: Date;
};

const colums: ColumnDef<AcademicDegreeDto>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ getValue }) => (
      <TableCell className="justify-start">{getValue<string>()}</TableCell>
    ),
  },
  {
    accessorKey: "abbrevFem",
    header: "Abreviacion Feminina",
    cell: ({ getValue }) => (
      <TableCell className="justify-center">{getValue<string>()}</TableCell>
    ),
  },
  {
    accessorKey: "abbrevMas",
    header: "Abreviacion Masculina",
    cell: ({ getValue }) => (
      <TableCell className="justify-center">{getValue<string>()}</TableCell>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
    cell: ({ getValue }) => (
      <TableCell className="justify-center">
        {formatDate(getValue<Date>())}
      </TableCell>
    ),
  },
];

export default function ConfigGrades() {
  return (
    <DataTable
      columns={colums}
      queryKey="get-all-academic-degree-paginated"
      queryFn={getPaginatedAcademicDegree}
      placeholder="Filtrar grados academicos"
      emptyTitle="No hay grados academicos definidos"
      emptyDescription="Para ver grados academicos comienze definiendo un grados academico."
      createDialog={CreateGradeDialog}
      buttonLabel="Agregar grado académico"
    >
      {""}
    </DataTable>
  );
}
