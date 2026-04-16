import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppNavBar } from "./_components/app-navbar";
import "../globals.css";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin, type Role, Roles } from "@/lib/authorization/permissions";
import { AppSideBar } from "./_components/app-sidebar";

export const metadata: Metadata = {
  title: "App Constancias Doctorado en Ciencias Médicas",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await isAuthenticated();
  const adminUser = isAdmin(user.role as Role);
  return (
    <SidebarProvider>
      <AppSideBar
        hasActivities={adminUser || user.role === Roles.PROFESSOR}
        hasRequest={true}
        hasUser={adminUser}
        user={user}
      />
      <SidebarInset className="flex flex-col md:h-screen md:overflow-hidden">
        <AppNavBar user={user} />
        <main className="flex-1 md:overflow-hidden py-10 px-2 sm:px-6 lg:px-8 flex flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
