"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  type Certificate,
  type CertificateEditDto,
  certificateEditSchema,
} from "@/lib/types/certificate";
import { updateCertificateAction } from "../../certificate/[id]/edit/action";

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
      id: data.id,
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
              template: temp.template,
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
    const { isSuccess, value, error } = await updateCertificateAction(data);
    if (isSuccess) {
      toast.success("Certificado actualizado exitosamente", {
        description: `Se actualizó el certificado con nombre ${value.name}`,
      });
      form.reset();
      router.push(`/admin/certificate/${value.id}`);
    } else {
      toast.error("Error al crear el certificado", {
        description: error,
      });
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="form-edit-certificate">
        <ScrollArea className="h-[550px] w-full pr-4 mx-0">
          <FieldGroup className="gap-4 h-full">
            <FormInput
              control={form.control}
              name="name"
              placeholder="Ingresar nombre del certificado"
              description="Nombre que se mostrará en la aplicación para el certificado que está creando"
              label="Nombre"
            />
            {children}
          </FieldGroup>
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            type="button"
            className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground"
            onClick={() => {
              router.back();
              form.reset();
            }}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Guardando certificado...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Guardar
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
