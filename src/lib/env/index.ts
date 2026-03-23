import arkenv, { type } from "arkenv";

export const env = arkenv({
  DATABASE_URL: type("string.url"),
  BETTER_AUTH_SECRET: type("string > 1").default("aa"),
  BETTER_AUTH_URL: type("string.url").default("http://localhost:3000"),
  BETTER_AUTH_TRUST_HOST: type("boolean").default(true),
  NODE_ENV: "'development' | 'production' | 'test' = 'development'",
  RESEND_API_KEY: "string",
  FROM_EMAIL: type("string.email").default("tomas.b.c@outlook.com"),
});
