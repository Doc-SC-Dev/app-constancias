"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  type AcademicDegreeCreateDto,
  AcademicDegreeCreateSchema,
} from "@/lib/types/acadmic-grades";
import { auditedCreateAcadmicDegree } from "../../actions";

export default function CreateGradeDialog() {
  const queryClient = useQueryClient();
  const form = useForm<AcademicDegreeCreateDto>({
    resolver: arktypeResolver(AcademicDegreeCreateSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      abbrevFem: "",
      abbrevMas: "",
    },
  });

  const [open, setOpen] = useState<boolean>(false);
  const onSubmit = async (data: AcademicDegreeCreateDto) => {
    const result = await auditedCreateAcadmicDegree({
      ...data,
    });
    if (result.isSuccess) {
      toast.success("Grado académico creado exitosamente", {
        description: `Se creo el grado académico con nombre ${result.value?.name}`,
      });
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["get-all-academic-degree-paginated"],
      });
    } else {
      toast.error("Error al crear el grado académico", {
        description: result.error
          ? result.error
          : "Error al crear el grado académico",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Agregar grado academico
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar grado académico</DialogTitle>
          <DialogDescription>
            Ingrese los datos del grado académico que desea agregar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="mb-4">
            <FormInput
              control={form.control}
              name="name"
              description="Nombre del grado académico"
              label="Nombre"
              placeholder="Ingrese el nombre del grado académico"
            />
            <FormInput
              control={form.control}
              name="abbrevFem"
              description="Abreviatura femenina del grado académico"
              label="Abreviatura femenina"
              placeholder="Ingrese la abreviatura femenina del grado académico"
            />
            <FormInput
              control={form.control}
              name="abbrevMas"
              description="Abreviatura masculina del grado académico"
              label="Abreviatura masculina"
              placeholder="Ingrese la abreviatura masculina del grado académico"
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Spinner /> Guardando
                </>
              ) : (
                "Agregar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
