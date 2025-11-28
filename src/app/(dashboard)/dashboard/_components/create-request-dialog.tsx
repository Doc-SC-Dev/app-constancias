"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { type CreateRequest, createRequestSchema } from "@/lib/types/request";
import { createRequest, getRequestsTypes } from "../../action";

export default function CreateRequestDialog() {
  const { data: certificates, error } = useQuery({
    queryKey: ["certificate-types"],
    queryFn: getRequestsTypes,
  });

  const form = useForm<CreateRequest>({
    resolver: arktypeResolver(createRequestSchema),
    reValidateMode: "onChange",
    defaultValues: {
      certificateId: "",
    },
  });
  const onSubmit = async (data: CreateRequest) => {
    const { success, message } = await createRequest(data);
    if (success) {
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
        {certificates && (
          <Controller
            name="certificateId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-rhf-select-language">
                    Tipo de constancia
                  </FieldLabel>
                  <FieldDescription>
                    Selecciona el tipo de constancia que deseas solicitar.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-rhf-select-language"
                    aria-invalid={fieldState.invalid}
                    className="min-w-[120px]"
                  >
                    <SelectValue placeholder="Selecciona un tipo de constancia" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {certificates.map((certificate) => (
                      <SelectItem
                        key={certificate.id}
                        value={certificate.id as string}
                      >
                        {certificate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
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
