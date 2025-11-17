import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="es">
      <body className={`antialiased`}>
        <main>{children}</main>

        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            classNames: {
              title: "text-lg",
            },
          }}
        />
      </body>
    </html>
  );
}
