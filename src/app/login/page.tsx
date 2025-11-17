"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const result = await loginAction(formData);

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
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
