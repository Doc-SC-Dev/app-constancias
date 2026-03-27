"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import type { CreateAcademicDegreeInput } from "../../domain/AcademicDegree";
import { CreateAcademicDegreeSchema } from "../../infrastructure/academic-degree.schema";
import { useAcademicDegree } from "../hooks/useAcademicDegree";

export function CreateGradeDialog() {
  const { create } = useAcademicDegree();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    resolver: arktypeResolver(CreateAcademicDegreeSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      abbrevFem: "",
      abbrevMas: "",
    },
  });

  const onSubmit = async (data: CreateAcademicDegreeInput) => {
    const result = await create(data);
    if (result.isSuccess) {
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Agregar grado académico
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
