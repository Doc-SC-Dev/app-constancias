import arkenv from "arkenv";

export const env = arkenv({
  DATABASE_URL: "string.url",
  BETTER_AUTH_SECRET: "string > 1",
  BETTER_AUTH_URL: "string.url",
  BETTER_AUTH_TRUST_HOST: "boolean",
  NODE_ENV: "'development' | 'production' | 'test'"
});
