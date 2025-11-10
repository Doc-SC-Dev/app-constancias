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
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSideBar />
          <SidebarInset>
            <AppNavBar />
            <main className="p-10">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
