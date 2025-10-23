"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginAction } from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { loginSchema } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FormInput } from "./FormInput";
import { Button } from "./ui/button";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<typeof loginSchema.infer>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: arktypeResolver(loginSchema),
  });

  const onSubmit = async (data: typeof loginSchema.infer) => {
    const res = await loginAction(data);
    if (res.succes) {
      form.reset();
      toast.success(`Bienvenido ${data.email}`, {
        description: "Sesión iniciada correctamente.",
      });
    } else {
      toast.error("Error al iniciar session", {
        description: "Por alguna razón el inicio se sesión fallo.",
      });
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido</CardTitle>
          <CardDescription>
            Inicia sesión con tu correo y contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="email"
                label="Correo"
                placeholder="example@mail.com"
                password={undefined}
              />
              <FormInput
                control={form.control}
                name="password"
                label="Constraseña"
                password
                placeholder="Ingrese contraseña"
              />
              <Field>
                <Button type="submit">Iniciar Sesión</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
