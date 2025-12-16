import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function Home() {
  const _ = await isAuthenticated();
  redirect("/dashboard");
}
