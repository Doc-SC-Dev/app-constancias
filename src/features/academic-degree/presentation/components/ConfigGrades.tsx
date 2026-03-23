"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { LazyDataTable } from "@/components/dynamic-table";
import { TableCell } from "@/components/table-cell";
import { formatDate } from "@/lib/utils";
import type { AcademicDegree } from "../../domain/AcademicDegree";
import { getPaginatedAcademicDegreesAction } from "../actions";
import { CreateGradeDialog } from "./CreateGradeDialog";
import { DeleteDegreeAlertDialog } from "./DeleteDegreeAlertDialog";
import { EditAcademicDegreeSheet } from "./EditAcademicDegreeSheet";

const columns: ColumnDef<AcademicDegree>[] = [
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

export function ConfigGrades() {
  return (
    <LazyDataTable
      columns={columns}
      queryKey="get-all-academic-degree-paginated"
      queryFn={getPaginatedAcademicDegreesAction}
      placeholder="Filtrar grados académicos"
      emptyTitle="No hay grados académicos definidos"
      emptyDescription="Para ver grados académicos comience definiendo un grado académico."
      createDialog={CreateGradeDialog}
      containerClassName="h-fit max-h-full"
    />
  );
}
