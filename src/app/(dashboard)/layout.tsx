import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppNavBar } from "./_components/app-navbar";
import "../globals.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppSideBar } from "./_components/app-sidebar";

export const metadata: Metadata = {
  title: "App Constancias Doctorado en ciencias medicas",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nextHeader = await headers();
  const session = await auth.api.getSession({
    headers: nextHeader,
  });
  if (!session) redirect("/login");
  const [hasUser, hasRequest, hasActivities] = await Promise.all([
    auth.api.userHasPermission({
      headers: nextHeader,
      body: {
        userId: session.user.id,
        permissions: {
          user: ["list"],
        },
      },
    }),
    auth.api.userHasPermission({
      headers: nextHeader,
      body: {
        userId: session.user.id,
        permissions: {
          request: ["list"],
        },
      },
    }),
    auth.api.userHasPermission({
      headers: nextHeader,
      body: {
        userId: session.user.id,
        permissions: {
          activity: ["list"],
        },
      },
    }),
  ]);
  return (
    <SidebarProvider>
      <AppSideBar
        hasActivities={hasActivities.success}
        hasRequest={hasRequest.success}
        hasUser={hasUser.success}
        user={session.user}
      />
      <SidebarInset>
        <AppNavBar user={session.user} />
        <div className="p-8 h-full w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
