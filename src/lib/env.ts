import { createEnv } from "arkenv";

// Crear el validador de variables de entorno usando arkenv
// arkenv es la herramienta recomendada para validar variables de entorno con arktype
export const env = createEnv({
    // Variables requeridas
    DATABASE_URL: "string",
    NEXT_PUBLIC_APP_URL: "string",
    BETTER_AUTH_SECRET: "string",
    BETTER_AUTH_URL: "string",

    // Variables con valores por defecto
    NODE_ENV: "'development' | 'production' | 'test' = 'development'",

    // OAuth providers (opcionales)
    GOOGLE_CLIENT_ID: "string?",
    GOOGLE_CLIENT_SECRET: "string?",
    GITHUB_CLIENT_ID: "string?",
    GITHUB_CLIENT_SECRET: "string?",

    // Email configuration (opcionales)
    EMAIL_SERVER_HOST: "string?",
    EMAIL_SERVER_PORT: "string?",
    EMAIL_SERVER_USER: "string?",
    EMAIL_SERVER_PASSWORD: "string?",
    EMAIL_FROM: "string?",
});

// Exportar el tipo para uso en otros archivos
export type Env = typeof env;
