"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { isAdmin, type Role } from "@/lib/authorization/permissions";
import {
  Certificates,
  type CreateRequest,
  createRequestSchema,
} from "@/lib/types/request";
import type { User } from "@/lib/types/users";
import { createRequest } from "../../../../action";
import ActivitySelect from "./activity/activity-select";
import CertificateSelect from "./certificate/certificate-select";
import UserSelect from "./user/user-select";

export default function CreateRequestForm({
  user,
  setOpen,
}: {
  user: User;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<CreateRequest>({
    resolver: arktypeResolver(createRequestSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      certificateName: "",
      activityId: "",
      userId: isAdmin(user.role as Role) ? "" : user.id,
      description: "",
    },
    shouldUnregister: false,
  });
  const certificate = form.watch("certificateName");
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({
        queryKey: ["list-history-standard", "list-history-other"],
      });
      setOpen(false);
    } else {
      toast.error(message);
    }
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <UserSelect />
          <CertificateSelect />
          <ActivitySelect />
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
        <DialogFooter className="gap-4 pt-4">
          <DialogClose asChild onClick={() => form.reset()}>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> ...Creando petición
              </>
            ) : (
              "Crear"
            )}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
