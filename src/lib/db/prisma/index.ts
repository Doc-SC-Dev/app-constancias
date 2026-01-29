// lib/prisma.ts

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { auditStorage } from "@/lib/audit-storage";
import { env } from "@/lib/env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export function dbWithAutdit() {
  return db.$extends({
    query: {
      $allModels: {
        async update({ model, operation, query, args }) {
          if ("Log" === model) {
            await query(args);
            return;
          }

          const prisma = Prisma.getExtensionContext(this);
          const oldData = await (prisma as any).findUnique({
            where: args.where,
          });

          const newData = await query(args);

          const context = auditStorage.getStore();
          console.log({
            ...context,
            action: operation,
            changes: {
              new: newData,
              old: oldData,
            },
            resource: model,
            resourceId: args.where.id ?? "unknown",
          });
        },
        async create({ model, operation, query, args }) {
          if ("Log" === model) {
            await query(args);
            return;
          }

          const context = auditStorage.getStore();

          const newData = await query(args);

          console.log({
            ...context,
            action: operation,
            changes: {
              new: newData,
            },
            resource: model,
            resourceId: newData.id ?? "unknown",
          });
        },
      },
    },
  });
}
