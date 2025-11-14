import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppNavBar } from "./_components/app-navbar";
import "../globals.css";
import { AppSideBar } from "./_components/app-sidebar";

export const metadata: Metadata = {
  title: "App Constancias Doctorado en ciencias medicas",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <div className="flex flex-col w-full h-screen">
        <AppNavBar />
        <SidebarInset className="flex-1 m-0">
          <main className="overflow-auto p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
