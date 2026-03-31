import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CardTabs from "./_components/card-tabs";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) redirect("/dashboard");
  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-muted/30">
      <CardTabs />
    </div>
  );
}
