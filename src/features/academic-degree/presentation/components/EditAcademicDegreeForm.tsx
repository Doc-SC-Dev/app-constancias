"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import type {
  AcademicDegree,
  UpdateAcademicDegreeInput,
} from "../../domain/AcademicDegree";
import { UpdateAcademicDegreeSchema } from "../../infrastructure/academic-degree.schema";
import { useAcademicDegree } from "../hooks/useAcademicDegree";

export function EditAcademicDegreeForm({
  academicDegree,
  setOpen,
}: {
  academicDegree: AcademicDegree;
  setOpen: (open: boolean) => void;
}) {
  const { update } = useAcademicDegree();

  const form = useForm({
    resolver: arktypeResolver(UpdateAcademicDegreeSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: academicDegree,
  });

  const onSubmit = async (data: UpdateAcademicDegreeInput) => {
    const { isSuccess } = await update(data);
    if (isSuccess) setOpen(false);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-4"
    >
      <FieldGroup>
        <FormInput
          name="name"
          control={form.control}
          label="Nombre"
          description="Nombre de la condecoración"
        />
        <FormInput
          control={form.control}
          name="abbrevFem"
          label="Abreviatura Femenina"
          description="Abreviatura de la condecoración en femenino"
        />
        <FormInput
          control={form.control}
          name="abbrevMas"
          label="Abreviatura Masculina"
          description="Abreviatura de la condecoración en masculino"
        />
      </FieldGroup>
      <SheetFooter>
        <SheetClose asChild>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => form.reset()}
          >
            <X className="mr-2" />
            Cancelar
          </Button>
        </SheetClose>
        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? (
            <>
              <Spinner className="mr-2" /> Guardando
            </>
          ) : (
            <>
              <Save className="mr-2" /> Guardar
            </>
          )}
        </Button>
      </SheetFooter>
    </form>
  );
}
