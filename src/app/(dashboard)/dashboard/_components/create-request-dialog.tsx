"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
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
import type { Role } from "@/generated/prisma";
import { isAdmin } from "@/lib/authorization/permissions";
import {
  Certificates,
  type CreateRequest,
  createRequestSchema,
} from "@/lib/types/request";
import type { User } from "@/lib/types/users";
import {
  createRequest,
  getNotAdminUsers,
  getRequestsTypes,
} from "../../action";

export default function CreateRequestDialog({ user }: { user: User }) {
  const { data, error } = useQuery({
    queryKey: ["certificate-types"],
    queryFn: getRequestsTypes,
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ["get-none-admin-user"],
    queryFn: getNotAdminUsers,
  });

  const form = useForm<CreateRequest>({
    resolver: arktypeResolver(createRequestSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      certificateName: Certificates.ALUMNO_REGULAR,
      activityId: "",
      userId: isAdmin(user.role as Role) ? "" : user.id,
      description: "",
    },
    shouldUnregister: false,
  });
  const certificate = form.watch("certificateName");
  const userId = form.watch("userId");
  const onSubmit = async (data: CreateRequest) => {
    const {
      success,
      message,
      data: pdf,
    } = await createRequest({
      certificateName: data.certificateName,
      activityId: data.activityId,
      userId: data.userId ?? user.id,
      description: data.description,
    });
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
        {data && (
          <FieldGroup>
            {isAdmin(user.role as Role) && (
              <FormSelect
                control={form.control}
                name="userId"
                label="Usuario"
                description="Seleccione un usuario crear una solicitud en su nombre"
              >
                {isLoading && !users && <Spinner />}
                {users
                  ? users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))
                  : ""}
              </FormSelect>
            )}
            {users && (userId || !isAdmin(user.role as Role)) && (
              <FormSelect
                control={form.control}
                name="certificateName"
                label="Tipo de constancia"
                description="Selecciona el tipo de constancia que deseas solicitar."
              >
                {data.certificates.map((certificate) => {
                  const user = users.find((user) => user.id === userId);
                  if (certificate.roles.includes(user?.role as Role))
                    return (
                      <SelectItem key={certificate.id} value={certificate.name}>
                        {certificate.name}
                      </SelectItem>
                    );
                  else return "";
                })}
              </FormSelect>
            )}
            {users &&
              userId &&
              ![Certificates.ALUMNO_REGULAR, Certificates.OTHER].includes(
                certificate as Certificates,
              ) && (
                <FormSelect
                  control={form.control}
                  name="activityId"
                  label="Actividad"
                  description="Selecciona la actividad a la que deseas solicitar la constancia."
                >
                  {data.activities.map((activity) => {
                    if (
                      activity.participants.find((p) => p.userId === userId) !==
                      undefined
                    ) {
                      return (
                        <SelectItem key={activity.id} value={activity.id}>
                          {activity.name}
                        </SelectItem>
                      );
                    } else return "";
                  })}
                </FormSelect>
              )}
            {certificate === Certificates.OTHER && (
              <FormInput
                control={form.control}
                name="description"
                label="Descripción"
                description="Describa el motivo de la solicitud."
                placeholder="Ingrese una descripción..."
              />
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
