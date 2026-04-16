"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { es } from "react-day-picker/locale";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAcademicDegree } from "@/app/(dashboard)/action";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Gender, Role } from "@/generated/prisma";
import { Roles } from "@/lib/authorization/permissions";
import { type UserCreate, userCreateSchema } from "@/lib/types/users";
import { Textos } from "@/lib/utils";
import { createUser } from "../actions";

export default function NewUserDialog({ userRole }: { userRole: Role }) {
  const [open, setOpen] = useState<boolean>(false);
  const { data: academicDegree } = useQuery({
    queryKey: ["get-all-academic-degree"],
    queryFn: getAcademicDegree,
  });
  const { handleSubmit, control, formState, reset, watch } =
    useForm<UserCreate>({
      resolver: arktypeResolver(userCreateSchema),
      reValidateMode: "onChange",
      defaultValues: {
        name: "",
        email: "",
        role: Roles.PROFESSOR,
        rut: "",
        studentId: "",
        academicGrade: "",
        admissionDate: new Date(),
        gender: Gender.OTHER,
      },
      shouldUnregister: true,
    });
  const role = watch("role");
  const onSubmit = async (user: UserCreate) => {
    const { success, message } = await createUser(user);
    if (!success) {
      toast.error("No se pudo crear el usuario", {
        description: message,
      });
    }
    if (success) {
      toast.success("Se creó el usuario correctamente", {
        description: message,
      });
      reset();
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Agregar usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full p-0">
        <DialogHeader className="mb-4 w-full px-6 pt-6">
          <DialogTitle>Crear nuevo usuario</DialogTitle>
          <DialogDescription>
            Ingrese los datos para crear un nuevo usuario
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-[400] w-full px-2">
            <FieldGroup className="gap-4 w-full px-4">
              <FormInput
                label="Nombre"
                control={control}
                name="name"
                description="Ingrese el nombre completo del nuevo usuario"
              />
              <FormInput
                label="Email"
                control={control}
                name="email"
                description="Ingrese el correo que será asociado a la cuenta del nuevo usuario"
              />
              <FormInput
                label="RUT"
                control={control}
                name="rut"
                description="La contraseña del nuevo usuario será su RUT sin puntos y con guión"
              />

              <FormSelect
                label="Grado académico"
                control={control}
                name="academicGrade"
                description="Seleccione el grado académico del nuevo usuario"
              >
                {academicDegree?.map((grade) => (
                  <SelectItem value={grade.id} key={grade.id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </FormSelect>
              <FormSelect
                name="gender"
                control={control}
                label="Género"
                description="Seleccione el género del nuevo usuario"
              >
                {Object.values(Gender).map((gender) => (
                  <SelectItem value={gender} key={gender}>
                    {Textos.Gender[gender] || gender}
                  </SelectItem>
                ))}
              </FormSelect>

              <FormSelect
                label="Rol"
                control={control}
                name="role"
                description="Seleccione el rol que tendrá en la plataforma el nuevo usuario"
              >
                {[...Object.values(Roles)].map((rol) => {
                  if (
                    userRole !== Roles.SUPERADMIN &&
                    rol === Roles.SUPERADMIN
                  ) {
                    return undefined;
                  }
                  return (
                    <SelectItem value={rol} key={rol}>
                      {Textos.Role[rol] || rol}
                    </SelectItem>
                  );
                })}
              </FormSelect>

              {role === Role.STUDENT && (
                <>
                  <FieldSeparator />
                  <FormInput
                    label="Matrícula"
                    control={control}
                    name="studentId"
                    description="Ingrese el número de matrícula del nuevo estudiante"
                  />

                  <Controller
                    name="admissionDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldLabel>Fecha de Admisión</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              aria-invalid={fieldState.invalid}
                              value={field.value?.toLocaleDateString("es-CL")}
                            />
                            <InputGroupAddon align="inline-end">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button type="button" variant="ghost">
                                    <CalendarIcon />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <Calendar
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    mode="single"
                                    fixedWeeks={true}
                                    locale={es}
                                  />
                                </PopoverContent>
                              </Popover>
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />
                </>
              )}
            </FieldGroup>
          </ScrollArea>
          <DialogFooter className="mt-6 pb-6 px-6">
            <DialogClose asChild onClick={() => reset()}>
              <Button 
                variant="outline" 
                className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive active:bg-destructive/90 active:border-destructive/90 active:text-destructive-foreground"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="default"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? <Spinner /> : <Save className="mr-2 h-4 w-4" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
