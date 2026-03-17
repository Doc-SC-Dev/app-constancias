"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { TableCell } from "@/components/table-cell";
import { formatDate } from "@/lib/utils";
import { getPaginatedAcademicDegree } from "../actions";
import CreateGradeDialog from "./dialogs/create-grade-dialog";
import DeleteDegreeAlertDialog from "./dialogs/delete-degree-alert-dialog";
import EditAcademicDegreeSheet from "./sheet/edit-academic-degree-sheet";

export type AcademicDegreeDto = {
  id: string;
  name: string;
  abbrevFem: string;
  abbrevMas: string;
  abbrevFemId: string;
  abbrevMasId: string;
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
    header: () => (
      <TableCell className="justify-center">Abreviación Femenina</TableCell>
    ),
    cell: ({ getValue }) => (
      <TableCell className="justify-center">{getValue<string>()}</TableCell>
    ),
  },
  {
    accessorKey: "abbrevMas",
    header: () => (
      <TableCell className="justify-center">Abreviación Masculina</TableCell>
    ),
    cell: ({ getValue }) => (
      <TableCell className="justify-center">{getValue<string>()}</TableCell>
    ),
  },
  {
    accessorKey: "createdAt",
    enableGlobalFilter: false,
    header: () => (
      <TableCell className="justify-center">Fecha de creación</TableCell>
    ),
    cell: ({ getValue }) => (
      <TableCell className="justify-center">
        {formatDate(getValue<Date>())}
      </TableCell>
    ),
  },
  {
    id: "actions",
    header: () => <TableCell className="justify-center">Acciones</TableCell>,
    cell: ({ row }) => (
      <TableCell className="justify-center">
        <EditAcademicDegreeSheet academicDegree={row.original} />
        <DeleteDegreeAlertDialog academicDegree={row.original} />
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
      placeholder="Filtrar grados académicos"
      emptyTitle="No hay grados académicos definidos"
      emptyDescription="Para ver grados académicos comience definiendo un grado académico."
      createDialog={CreateGradeDialog}
    />
  );
}
