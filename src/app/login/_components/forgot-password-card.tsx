"use client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { type ForgotPassword, forgotPasswordSchema } from "@/lib/types/login";
import { forgotPassword } from "../actions";

type Props = {
  goToTab: () => void;
};
export default function ForgotPasswordCard({ goToTab }: Props) {
  const [cooldown, setCooldown] = useState(0);
  const [lastEmail, setLastEmail] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const form = useForm<ForgotPassword>({
    resolver: arktypeResolver(forgotPasswordSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data: ForgotPassword) => {
    const { success, message } = await forgotPassword(data);
    if (!success) {
      toast.error(message);
      return;
    }
    toast.success(message);
    setLastEmail(data.email);
    setCooldown(30);
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-md shadow-lg ">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Recuperar Contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo electrónico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4">
            {cooldown > 0 ? (
              <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300">
                <AlertTitle>Correo enviado</AlertTitle>
                <AlertDescription>
                  <p>
                    Se ha enviado un correo a <strong>{lastEmail}</strong>.
                  </p>
                  <p>Podrás reenviar otro en {cooldown} segundos.</p>
                </AlertDescription>
              </Alert>
            ) : (
              <FormInput name="email" control={form.control} label="Email" />
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          {cooldown === 0 && (
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Spinner />}
              {form.formState.isSubmitting
                ? "Enviando Correo"
                : "Enviar Correo"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
