import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Spinner } from "@/components/ui/spinner";
import { type ResetPassword, resetPasswordSchema } from "@/lib/types/users";
import { resetPassword } from "../actions";

export default function ResetPasswordCard({ token }: { token: string }) {
  const router = useRouter();
  const form = useForm<ResetPassword>({
    resolver: arktypeResolver(resetPasswordSchema),
    reValidateMode: "onChange",
    defaultValues: {
      newPass: "",
      confirPass: "",
    },
  });

  const onSubmit = async (data: ResetPassword) => {
    const { success, message } = await resetPassword(token, data.newPass);
    if (!success) {
      toast.error(message);
    } else {
      toast.success("Contraseña restablecida exitosamente");
      router.push("/login");
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="min-w-md">
        <CardHeader>
          <CardTitle>Restablecer Contraseña</CardTitle>
          <CardDescription>Ingrese su nueva contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PasswordInput
              label="Contraseña"
              name="newPass"
              control={form.control}
            />
            <PasswordInput
              label="Verificar Contraseña"
              name="confirPass"
              control={form.control}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting
              ? "Restableciendo Contraseña..."
              : "Restablecer Contraseña"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
