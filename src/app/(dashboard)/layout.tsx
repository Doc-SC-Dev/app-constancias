import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppNavBar } from "./_components/app-navbar";
import "../globals.css";
import { auth, isAuthenticated } from "@/lib/auth";
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
  const session = await isAuthenticated();
  const [hasUser, hasRequest, hasActivities] = await Promise.all([
    auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          user: ["list"],
        },
      },
    }),
    auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          request: ["list"],
        },
      },
    }),
    auth.api.userHasPermission({
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
        <main className="h-full py-10 px-2 sm:px-6 lg:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
