# Configuración de Variables de Entorno

Este proyecto utiliza Zod para validar las variables de entorno de forma type-safe.

## Archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/cotizador_canela"

# Next.js
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Better Auth
BETTER_AUTH_SECRET="tu-secret-super-seguro-de-al-menos-32-caracteres"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (opcionales)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_CLIENT_ID=""
# GITHUB_CLIENT_SECRET=""

# Email (opcionales)
# EMAIL_SERVER_HOST=""
# EMAIL_SERVER_PORT=""
# EMAIL_SERVER_USER=""
# EMAIL_SERVER_PASSWORD=""
# EMAIL_FROM=""
```

## Variables Requeridas

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `NEXT_PUBLIC_APP_URL`: URL pública de la aplicación
- `BETTER_AUTH_SECRET`: Secreto para Better Auth (mínimo 32 caracteres)
- `BETTER_AUTH_URL`: URL base para Better Auth

## Variables Opcionales

- `NODE_ENV`: Entorno de ejecución (default: "development")
- Variables de OAuth (Google, GitHub)
- Variables de configuración de email

## Uso en el Código

```typescript
import { env } from "@/lib/env";

// Las variables están validadas y tipadas
console.log(env.DATABASE_URL); // string
console.log(env.NODE_ENV); // "development" | "production" | "test"
```

## Validación

El schema valida automáticamente las variables al importar `env`. Si alguna variable requerida falta o tiene un formato incorrecto, la aplicación mostrará un error descriptivo.
