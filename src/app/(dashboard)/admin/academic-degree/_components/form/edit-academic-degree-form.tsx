"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
  type AcademicDegreeEditDto,
  AcademicDegreeEditSchema,
} from "@/lib/types/acadmic-grades";
import { auditedEditAcademicDegree } from "../../actions";
import type { AcademicDegreeDto } from "../config-grades";

export default function EditAcademicDegreeForm({
  academicDegree,
}: {
  academicDegree: AcademicDegreeDto;
}) {
  const form = useForm<AcademicDegreeEditDto>({
    resolver: arktypeResolver(AcademicDegreeEditSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: academicDegree,
  });

  const onSubmit = async (data: AcademicDegreeEditDto) => {
    const result = await auditedEditAcademicDegree(data);
    if (result.isSuccess) {
      toast.success("Condecoración editada correctamente");
      form.reset();
    } else {
      toast.error(result.error);
    }
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
