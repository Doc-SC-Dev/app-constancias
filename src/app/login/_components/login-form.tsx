"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { loginAction } from "../actions";
import { type LoginData, loginSchema } from "../loginSchema";

export default function LoginForm() {
  const form = useForm<LoginData>({
    resolver: arktypeResolver(loginSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const onSubmit = async (data: LoginData) => {
    try {
      const result = await loginAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado de la aplicación");
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup className="gap-4">
        <FormInput name="email" control={form.control} label="Email" />
        <FormInput
          name="password"
          control={form.control}
          label="Contraseña"
          password
        />
      </FieldGroup>
      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting && <Spinner />}
        {form.formState.isSubmitting ? "Iniciando Sesión" : "Iniciar Sesión"}
      </Button>
    </form>
  );
}
