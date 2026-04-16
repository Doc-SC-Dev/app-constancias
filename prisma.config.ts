// import "dotenv/config";

/** @type {import('prisma/config').PrismaConfig} */
export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/new-seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
