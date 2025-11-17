"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { arktypeResolver } from "@hookform/resolvers/arktype"; 
import { loginSchema, type LoginData } from "./loginSchema"; 

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { loginAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

 const form = useForm<LoginData>({
  resolver: async (values, context, options) => {
    const resolved = await arktypeResolver(loginSchema)(values, context, options);

    const errors = resolved.errors;
    if (errors) {
      const errorKeys = Object.keys(errors) as Array<keyof typeof errors>;
      errorKeys.forEach((fieldName) => {
        const error = errors[fieldName];
        if (error?.message) {
          if (fieldName === 'email') {
            error.message = 'Por favor, ingresa un correo electrónico válido';
          } else if (fieldName === 'password') {
            error.message = 'La contraseña es obligatoria';
          }
        }
      });
    }
    
    return resolved;
  },
  defaultValues: {
    email: "",
    password: "",
  },
});

  const onSubmit = (data: LoginData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);

        const result = await loginAction(formData);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.push("/home");
      } catch (err) {
        console.error(err);
        toast.error("Error inesperado de la aplicaciÃ³n");
      }
    });
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage /> 
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage /> 
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}