import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    toast.success("Inicio sesión exitoso", {
      description: `Bienvenido ${session.user.name}`,
    });
    redirect("/dashboard");
  } else redirect("/login");
}
