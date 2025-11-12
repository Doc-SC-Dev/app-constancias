"use client";

import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    console.log("Login con:", email, password);

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md ">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email-input">Correo Electrónico</Label>
              <Input
                id="email-input"
                type="email"
                value={email}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setEmail(e.target.value)
                }
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password-input">Contraseña</Label>
              <Input
                id="password-input"
                type="password"
                value={password}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setPassword(e.target.value)
                }
                placeholder="********"
              />
            </div>
            <Button type="submit">Ingresar</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-gray-400 mt-4 text-sm">
            ¿Olvidaste tu contraseña?{" "}
            <a className="text-blue-500 hover:underline" href="/register">
              Recuperar aquí
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
