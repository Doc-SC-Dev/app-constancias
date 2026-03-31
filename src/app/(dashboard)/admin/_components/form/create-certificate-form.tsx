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
  type CertificateCreateDto,
  certificateCreateSchema,
} from "@/lib/types/certificate";
import { createCertificateAction } from "../../certificate/create/action";

export default function CreateCertificateForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const form = useForm<CertificateCreateDto>({
    mode: "onChange",
    reValidateMode: "onSubmit",
    resolver: arktypeResolver(certificateCreateSchema),
    shouldUnregister: false,
    defaultValues: {
      name: "",
      templateLocation: "role",
      roles: [],
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

  const onSubmit = async (data: CertificateCreateDto) => {
    const { isSuccess, value, error } = await createCertificateAction(data);
    if (isSuccess) {
      toast.success("Certificado creado exitosamente", {
        description: `Se creó el certificado con nombre ${value.name}`,
      });
      form.reset();
      router.push("/admin/certificate");
    } else {
      toast.error("Error al crear el certificado", {
        description: error,
      });
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="w-full pr-4 h-[550px] mx-0">
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
