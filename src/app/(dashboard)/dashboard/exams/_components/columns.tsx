"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Exams } from "../actions";
import { EditExamDialog } from "./edit-exam-dialog";
import { useState } from "react";

function isExamEditable(startAt: string): boolean {
  const examDate = new Date(startAt);
  const editableFrom = new Date(examDate);
  editableFrom.setDate(editableFrom.getDate() + 1);
  editableFrom.setHours(0, 0, 0, 0);
  return new Date() >= editableFrom;
}

const ActionsCell = ({ exam, isAdmin }: { exam: Exams; isAdmin: boolean }) => {
  const [open, setOpen] = useState(false);
  const isTimeValid = isExamEditable(exam.startAt);
  const isApproved = exam.grade !== null && exam.grade >= 4.0;
  
  const canEdit = isTimeValid && (isAdmin || !isApproved);

  let tooltipText = "Debe esperar al menos un día después del examen para editar la nota.";
  if (isTimeValid && !isAdmin && isApproved) {
    tooltipText = "No puedes editar un examen que está aprobado.";
  }

  return (
    <span className="flex flex-1 items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={canEdit ? undefined : 0}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => canEdit && setOpen(true)}
                disabled={!canEdit}
              >
                Editar Nota
              </Button>
            </span>
          </TooltipTrigger>
          {!canEdit && (
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <EditExamDialog
        open={open}
        onOpenChange={setOpen}
        exam={exam}
      />
    </span>
  );
};

export const getColumns = (isAdmin: boolean): ColumnDef<Exams>[] => [
  {
    accessorKey: "activityName",
    header: "Actividades",
    cell({ row }) {
      return (
        <div className="flex flex-1 items-center">
          <p>{row.getValue("activityName")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "activityType",
    header: "Tipo de Actividad",
    cell({ row }) {
      return (
        <div className="flex flex-1 items-center">
          <p>{row.getValue("activityType")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "userName",
    header: "Profesor a Cargo",
    cell({ row }) {
      return (
        <div className="flex flex-1 items-center">
          <p>{row.getValue("userName")}</p>
        </div>
      );
    },
  },
  {
    id: "dates",
    header: () => <span className="flex flex-1 justify-center">Fecha</span>,
    cell({ row }) {
      const from = new Date(row.original.startAt)
        .toLocaleDateString("es-CL")
        .replaceAll("-", "/");
      const to = row.original.endAt;

      return (
        <div className="flex flex-1 items-center justify-center">
          <p>
            {to
              ? from +
              " - " +
              new Date(to).toLocaleDateString("es-CL").replaceAll("-", "/")
              : from}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "grade",
    header: () => <p className="flex flex-1 justify-center">Estado</p>,
    cell({ row }) {
      const grade = row.getValue("grade") as number | null;
      let stateLabel = "Pendiente";
      let badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
      let dotClass = "bg-yellow-500";

      if (grade !== null && grade > 0) {
        if (grade >= 1.0 && grade <= 3.9) {
          stateLabel = "Reprobado";
          badgeClass = "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
          dotClass = "bg-red-500";
        } else if (grade >= 4.0 && grade <= 7.0) {
          stateLabel = "Aprobado";
          badgeClass = "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
          dotClass = "bg-green-500";
        }
      }

      return (
        <div className="flex flex-1 items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Badge variant="outline" className={cn("gap-2 font-normal hover:opacity-80 transition-opacity whitespace-nowrap", badgeClass)}>
                    <span className={cn("size-2 rounded-full", dotClass)} />
                    {stateLabel}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nota: {grade !== null && grade > 0 ? grade.toString().replace(".", ",") : "N/A"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <p className="flex flex-1 justify-center">Acciones</p>,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const exam = row.original;
      return <ActionsCell exam={exam} isAdmin={isAdmin} />;
    },
  },
];
