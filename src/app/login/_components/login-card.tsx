"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import PasswordInput from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { loginAction } from "../actions";
import { type LoginData, loginSchema } from "../loginSchema";

type Props = {
  goToTab: () => void;
};

export default function LoginCard({ goToTab }: Props) {
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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-md shadow-lg ">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa con tus credenciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4">
            <FormInput name="email" control={form.control} label="Email" />
            <PasswordInput
              name="password"
              control={form.control}
              label="Contraseña"
              forgot={goToTab}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting
              ? "Iniciando Sesión"
              : "Iniciar Sesión"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
