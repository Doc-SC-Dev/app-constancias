"use client";

import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth/better-auth/client";
import { loginAction } from "./actions";
import { type LoginData, loginSchema } from "./loginSchema";

export default function LoginPage() {
  const { data } = useSession();
  const router = useRouter();
  const form = useForm<LoginData>({
    resolver: arktypeResolver(loginSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (data) {
    router.replace("/dashboard");
  }

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa con tus credenciales
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {form.formState.isSubmitting
                ? "Iniciando Sesión"
                : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
