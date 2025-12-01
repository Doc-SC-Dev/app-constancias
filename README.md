# Sistema de Constancias de Doctorado

## Requisitos previos

- Node.js (versión 18 o superior)
- PNPM (gestor de paquetes)
- PostgreSQL

## Tecnologías Principales

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **UI/Estilos**: React 19, Tailwind CSS 4, Radix UI, Lucide React
- **Base de Datos**: PostgreSQL, Prisma ORM
- **Autenticación**: Better Auth
- **Gestión de Estado/Data**: React Query, React Hook Form + Zod
- **Utilidades**: Puppeteer & PDF-lib (Generación de PDFs), React Email & Resend (Emails)

## Configuración inicial

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd constancias-doctorado
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

1. Copiar el archivo de ejemplo de variables de entorno:

```bash
cp env.example .env
```

2. Editar el archivo `.env` y configurar las siguientes variables:

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `BETTER_AUTH_SECRET`: Clave secreta para autenticación (generar con `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: URL base de la aplicación
- `EMAIL_SERVER_*`: Configuración del servidor SMTP para emails
- `NODE_ENV`: Entorno de ejecución

### 4. Configurar la base de datos

Ejecutar las migraciones de Prisma para crear las tablas necesarias:

```bash
pnpm prisma migrate dev
```

## Desarrollo

### Iniciar el entorno de desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### Acceder a Prisma Studio (gestión de base de datos)

```bash
pnpm prisma studio
```

## Producción

### Construir la aplicación

```bash
pnpm build
```

### Iniciar en modo producción

```bash
pnpm start
```

## Comandos útiles

- `pnpm dev`: Inicia el servidor de desarrollo
- `pnpm build`: Construye la aplicación para producción
- `pnpm start`: Inicia la aplicación en modo producción
- `pnpm prisma generate`: Regenera el cliente de Prisma
- `pnpm prisma migrate dev`: Aplica las migraciones de base de datos
- `pnpm prisma studio`: Abre la interfaz de gestión de base de datos

## Estructura del proyecto

```
├── prisma/           # Esquema y migraciones de base de datos
├── public/           # Archivos estáticos
├── src/
│   ├── app/         # Rutas y componentes de Next.js
│   ├── components/  # Componentes reutilizables de UI
│   ├── generated/   # Código generado
│   ├── hooks/       # Custom hooks
│   └── lib/         # Utilidades y configuraciones
```

## Notas importantes

- Asegúrate de nunca compartir el archivo `.env` con valores reales
- En producción, configura `BETTER_AUTH_TRUST_HOST="true"` si usas HTTPS
- Mantén las dependencias actualizadas con `pnpm update`
