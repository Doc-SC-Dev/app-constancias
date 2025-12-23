"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormSelect } from "@/components/form/FormSelect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Certificates,
  type CreateRequest,
  createRequestSchema,
} from "@/lib/types/request";
import { createRequest, getRequestsTypes } from "../../action";

export default function CreateRequestDialog() {
  const { data, error } = useQuery({
    queryKey: ["certificate-types"],
    queryFn: getRequestsTypes,
  });

  const form = useForm<CreateRequest>({
    resolver: arktypeResolver(createRequestSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      certificateName: Certificates.ALUMNO_REGULAR,
      activityId: "",
    },
    shouldUnregister: true,
  });
  const certificate = form.watch("certificateName");
  const activityById = useMemo(() => {
    if (!data) return new Map();
    return new Map(data.activities.map((activity) => [activity.id, activity]));
  }, [data]);

  const onSubmit = async (data: CreateRequest) => {
    const {
      success,
      message,
      data: pdf,
    } = await createRequest({
      certificateName: data.certificateName,
      activity: activityById.get(data.activityId),
    });
    if (success) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${pdf}`;
      link.download = `${data.certificateName}.pdf`;
      link.click();
      toast.success(message);
      form.reset();
    } else {
      toast.error(message);
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Crear solicitud de Constancia</DialogTitle>
        <DialogDescription>
          Complete el formulario para crear una nueva solicitud de constancia.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {data && (
          <FieldGroup>
            <FormSelect
              control={form.control}
              name="certificateName"
              label="Tipo de constancia"
              description="Selecciona el tipo de constancia que deseas solicitar."
            >
              {data.certificates.map((certificate) => (
                <SelectItem key={certificate.id} value={certificate.name}>
                  {certificate.name}
                </SelectItem>
              ))}
            </FormSelect>
            {certificate !== Certificates.ALUMNO_REGULAR && (
              <FormSelect
                control={form.control}
                name="activityId"
                label="Actividad"
                description="Selecciona la actividad a la que deseas solicitar la constancia."
              >
                {data.activities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.name}
                  </SelectItem>
                ))}
              </FormSelect>
            )}
          </FieldGroup>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error al cargar certificados</AlertTitle>
            <AlertDescription>
              Hubo un error al cargar los certificados que puedes solicitar. Por
              favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter className="gap-4 pt-4">
          <DialogClose asChild onClick={() => form.reset()}>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button type="submit">
            {form.formState.isSubmitting && <Spinner />}
            Crear
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
