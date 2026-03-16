# Contexto de Dependencias del Proyecto

> **Generado automáticamente:** Este documento contiene información actualizada sobre la arquitectura base de este proyecto obtenida vía Context7.

## 🏗️ Framework Principal

### Next.js (v15.5.6)

- **Propósito:** Framework de React para construir aplicaciones web full-stack con Server Components, Server Actions, enrutamiento basado en archivos (App Router) y renderizado optimizado por servidor.
- **Documentación Oficial:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Forma de uso recomendada:**
  ```typescript
  export default async function Page() {
    // Ejemplo de fetch dinámico con App Router (no se cachea)
    const data = await fetch(`https://api.example.com/data`, { cache: 'no-store' });
    const json = await data.json();
    return <div>{json.name}</div>;
  }
  ```

### React (v19.1.0)

- **Propósito:** Librería de JavaScript para construir interfaces de usuario interactivas, basada en componentes reutilizables y un enfoque declarativo.
- **Documentación Oficial:** [https://react.dev](https://react.dev)
- **Forma de uso recomendada:**
  ```javascript
  export default function Profile() {
    return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="User Profile" />;
  }
  ```

## 🎨 Librería de Componentes y UI

### Tailwind CSS (v4)

- **Propósito:** Framework de CSS basado en utilidades ("utility-first") que permite construir interfaces de usuario rápidas y consistentes sin salir del HTML/JSX.
- **Documentación Oficial:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Forma de uso recomendada:**
  ```html
  <div class="h-96 bg-blue-500/25 rounded-lg flex justify-center text-center">
    Contenido Estilizado
  </div>
  ```

### Radix UI Primitives (v1)

- **Propósito:** Componentes UI de bajo nivel, sin estilos predefinidos y completamente accesibles (compatibles con WAI-ARIA) que sirven de base para sistemas de diseño (como shadcn/ui).
- **Documentación Oficial:** [https://www.radix-ui.com/primitives/docs](https://www.radix-ui.com/primitives/docs)
- **Forma de uso recomendada:**

  ```jsx
  import * as Dialog from "@radix-ui/react-dialog";
  import { Cross1Icon } from "@radix-ui/react-icons";

  export default () => (
    <Dialog.Root>
      <Dialog.Trigger>Abrir Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Título Accesible</Dialog.Title>
          <Dialog.Description>
            Descripción accesible para lectores de pantalla
          </Dialog.Description>
          <Dialog.Close aria-label="Cerrar">
            <Cross1Icon />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
  ```

## 🗄️ Base de Datos y ORM

### Prisma ORM (v7.1.0)

- **Propósito:** ORM de próxima generación para Node.js y TypeScript que ofrece consultas a bases de datos con tipado completamente estricto, modelado de esquema declarativo y migraciones automatizadas.
- **Documentación Oficial:** [https://prisma.io/docs](https://prisma.io/docs)
- **Forma de uso recomendada:**

  ```typescript
  import { PrismaClient } from "@prisma/client";

  // Instancia única (recomendado para Next.js)
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
  export const prisma = globalForPrisma.prisma || new PrismaClient();

  // Ejemplo de consulta compleja de forma sencilla
  const users = await prisma.user.findMany({
    where: { active: true },
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { profile: true } // Relaciones de forma nativa
  });
  ```

## 🔌 Servicios Externos (Auth, Mails, etc.)

### Better Auth

- **Propósito:** Framework agnóstico de autenticación y autorización para TypeScript. Resuelve el registro e inicio de sesión por email o proveedores sociales, manejo de tokens y sesiones.
- **Documentación Oficial:** [https://better-auth.com/docs](https://better-auth.com/docs)
- **Forma de uso recomendada:**

  ```typescript
  import { authClient } from "@/lib/auth-client";

  const handleSignIn = async () => {
    const { data, error } = await authClient.signIn.email(
      {
        email: "user@example.com",
        password: "securePassword123",
        rememberMe: true
      },
      {
        onSuccess: (ctx) => {
          if (ctx.data.twoFactorRedirect) {
            window.location.href = "/two-factor";
          } else {
            window.location.href = "/dashboard";
          }
        }
      }
    );
  };
  ```

### Resend

- **Propósito:** API de correo electrónico para programadores orientada a enviar correos transaccionales y de marketing de manera programática mediante SDK.
- **Documentación Oficial:** [https://resend.com/docs](https://resend.com/docs)
- **Forma de uso recomendada:**

  ```typescript
  import { Resend } from "resend";

  const resend = new Resend("re_xxxxxxxxx");

  // En una Ruta de API o Server Action
  const { data, error } = await resend.emails.send({
    from: "Notificaciones <onboarding@resend.dev>",
    to: ["usuario@dominio.com"],
    subject: "¡Bienvenido!",
    html: "<strong>Este es un correo de prueba</strong>"
  });
  ```
