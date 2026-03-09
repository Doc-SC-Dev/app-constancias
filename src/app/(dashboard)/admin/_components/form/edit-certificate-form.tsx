"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { selectRowsFn } from "@tanstack/react-table";
import { validateAst } from "arktype/internal/parser/ast/validate.ts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FieldGroup } from "@/components/ui/field";
import {
  type Certificate,
  type CertificateEditDto,
  certificateEditSchema,
} from "@/lib/types/certificate";
import { createCertificateAction } from "../../certificate/create/action";

export default function EditCertificateForm({
  children,
  data,
}: {
  children: React.ReactNode;
  data: Certificate;
}) {
  let activityTypes: { id: string; name: string }[] = [];
  new Set();
  if (data.variant === "participant") {
    activityTypes = data.template
      .map((val) => ({
        id: val.participantType.activityType.id,
        name: val.participantType.activityType.name,
      }))
      .filter(
        (value, index, self) =>
          self.findIndex((v) => v.id === value.id) === index,
      );
  }
  const router = useRouter();
  const form = useForm<CertificateEditDto>({
    mode: "onChange",
    reValidateMode: "onSubmit",
    resolver: arktypeResolver(certificateEditSchema),
    shouldUnregister: false,
    defaultValues: {
      name: data.name,
      templateLocation: data.variant,
      roles:
        data.variant === "role"
          ? data.template.map((temp) => ({ ...temp, templateId: temp.id }))
          : undefined,
      activityTypes:
        data.variant === "activity"
          ? data.template.map((temp) => ({
              id: temp.activityType.id,
              name: temp.activityType.name,
              templateId: temp.id,
            }))
          : data.variant === "participant"
            ? activityTypes
            : undefined,
      participantTypes:
        data.variant === "participant"
          ? data.template.map((val) => ({
              id: val.participantType.id,
              name: val.participantType.name,
              template: val.template,
              templateId: val.id,
            }))
          : undefined,
    },
  });

  const templateLocation = form.watch("templateLocation");

  // Al cambiar templateLocation, desregistrar los campos de las ramas que ya no aplican
  // para que no queden en el estado ni se envíen en el submit.
  useEffect(() => {
    if (templateLocation === "role") {
      form.unregister(["activityTypes", "participantTypes"]);
    } else if (templateLocation === "activity") {
      form.unregister(["roles", "participantTypes"]);
    } else if (templateLocation === "participant") {
      form.unregister("roles");
    }
  }, [templateLocation, form]);

  const onSubmit = async (data: CertificateEditDto) => {
    const { isSuccess, value, error } = await createCertificateAction(data);
    if (isSuccess) {
      toast.success("Certificado creado exitosamente", {
        description: `Se creo el certificado con nombre ${value.name}`,
      });
      form.reset();
      router.push("/admin?tab=certificates");
    } else {
      toast.error("Error al crear el certificado", {
        description: error,
      });
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form-edit-certificate">
        <FieldGroup className="gap-4 h-full">
          <FormInput
            control={form.control}
            name="name"
            placeholder="Ingresar nombre del certificado"
            description="Nombre que se mostrara en la aplicación para el certificado que esta creando"
            label="Nombre"
          />
          {children}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
