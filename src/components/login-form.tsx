"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginAction } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema } from "@/lib/types";
import { FormInput } from "./FormInput";
import { Spinner } from "./ui/spinner";

export function LoginForm() {
  const form = useForm<typeof loginSchema.infer>({
    resolver: arktypeResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const handleSubmit = async (data: typeof loginSchema.infer) => {
    const { error, success } = await loginAction(data);
    if (success) {
      toast.success(`Bienvenido ${data.email}`, {
        description: "Login exitoso",
      });
      router.replace("/");
    } else {
      toast.error(error, {
        description: "Error en Login",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu correo electrónico y contraseña para acceder
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            label="Correo"
            name="email"
            placeholder="email@example.com"
          />

          <FormInput
            control={form.control}
            label="Contraseña"
            name="password"
            password
            placeholder="**********"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
