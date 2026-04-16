"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQueryClient } from "@tanstack/react-query";
import { type } from "arktype";
import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormLabel } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Exams } from "../actions";
import { updateExamGrade } from "../actions";

const formSchema = type("string")
  .configure({
    message: () => "Debe ingresar una nota válida.",
  })
  .narrow((val, ctx) => {
    if (!/^[0-9]+([.,][0-9]*)?$/.test(val.trim())) {
      return ctx.reject({
        code: "predicate",
        message: "Debe ingresar una nota válida.",
      });
    }

    const normalizedVal = val.replace(",", ".");
    const parsed = parseFloat(normalizedVal);

    if (Number.isNaN(parsed)) {
      return ctx.reject({
        code: "predicate",
        message: "Debe ingresar una nota numérica.",
      });
    }
    if (parsed < 1.0 || parsed > 7.0) {
      return ctx.reject({
        code: "predicate",
        message: "La nota debe estar entre 1.0 y 7.0",
      });
    }
    return true;
  });

export type ExamGradeDto = {
  grade: string;
};

interface EditExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exams | null;
}

export function EditExamDialog({
  open,
  onOpenChange,
  exam,
}: EditExamDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ExamGradeDto>({
    resolver: arktypeResolver(type({ grade: formSchema })),
    defaultValues: {
      grade: "",
    },
  });

  useEffect(() => {
    if (exam && open) {
      form.reset({
        grade:
          exam.grade !== null && exam.grade > 0
            ? exam.grade.toString().replace(".", ",")
            : "",
      });
    }
  }, [exam, form, open]);

  async function onSubmit(values: ExamGradeDto) {
    if (!exam || !exam.studentId) {
      toast.error("No se encontró el estudiante asociado a este examen.");
      return;
    }

    setIsPending(true);
    try {
      const normalizedGrade = parseFloat(values.grade.replace(",", "."));
      const result = await updateExamGrade({
        activityId: exam.id,
        studentId: exam.studentId,
        grade: normalizedGrade,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Nota actualizada exitosamente.");
      queryClient.invalidateQueries({ queryKey: ["list-exams"] });
      onOpenChange(false);
    } catch (_error) {
      toast.error("Ocurrió un error al actualizar la nota.");
    } finally {
      setIsPending(false);
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        form.reset();
      }
    }
  };

  if (!exam) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Nota de Examen</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="space-y-2">
              <FormLabel className="text-muted-foreground font-semibold">
                Nombre de la Actividad
              </FormLabel>
              <div className="text-base">{exam.activityName}</div>
            </div>

            <div className="space-y-4">
              <FormLabel className="text-muted-foreground font-semibold">
                Tabla de Notas
              </FormLabel>

              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[70%] text-foreground font-semibold">
                        Alumno
                      </TableHead>
                      <TableHead className="text-foreground font-semibold">
                        Nota
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium align-top pt-4">
                        {exam.studentName || "Sin estudiante asignado"}
                        {exam.studentRut && (
                          <div className="text-sm text-muted-foreground font-normal">
                            RUT: {exam.studentRut}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="align-top pt-3">
                        <FormInput
                          control={form.control}
                          name="grade"
                          placeholder="Ej: 6,5"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
                className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || !exam.studentId}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Guardar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
