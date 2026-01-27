"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import {
  type AcademicDegreeCreateDto,
  AcademicDegreeCreateSchema,
} from "@/lib/types/acadmic-grades";
import { createAcademicDegree } from "../actions";

export default function CreateGradeDialog({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
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

  const onSubmit = async (data: AcademicDegreeCreateDto) => {
    const result = await createAcademicDegree(data);
    if (result.isSuccess) {
      toast.success("Grado académico creado exitosamente", {
        description: `Se creo el grado académico con nombre ${result.value?.name}`,
      });
      closeDialog();
      form.reset();
    } else {
      toast.error("Error al crear el grado académico", {
        description: result.error
          ? result.error.message
          : "Error al crear el grado académico",
      });
    }
  };

  return (
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
          <Button type="submit">Agregar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
