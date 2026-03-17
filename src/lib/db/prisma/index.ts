// lib/prisma.ts

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
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
// src/lib/prisma.ts

const EXCLUDED_MODELS = ["Log", "Session"];

// 1. Definimos tipos auxiliares para tipar dinámicamente los argumentos de Prisma
type QueryArgs = {
  where?: Record<string, unknown>;
  data?: Record<string, unknown> | unknown;
};

// 2. Definimos una interfaz para los métodos de lectura dinámica en Prisma
interface PrismaDelegate {
  findUnique(args: {
    where: Record<string, unknown>;
  }): Promise<Record<string, unknown> | null>;
  findMany(args: {
    where: Record<string, unknown>;
  }): Promise<Record<string, unknown>[]>;
}

// 3. Type Guard seguro para validar si un objeto tiene un ID
function hasIdProperty(obj: unknown): obj is { id: string | number } {
  return typeof obj === "object" && obj !== null && "id" in obj;
}

export const dbWithAutdit = () =>
  db.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const mutativeOperations = [
            "create",
            "update",
            "delete",
            "upsert",
            "updateMany",
            "deleteMany",
          ];

          // Verificamos si debemos ignorar la operación
          if (
            !model ||
            EXCLUDED_MODELS.includes(model) ||
            !mutativeOperations.includes(operation)
          ) {
            return query(args);
          }

          const ctx = auditStorage.getStore() || {
            userId: null,
            userName: "SYSTEM",
          };

          // Tipado estricto para valores antiguos y nuevos
          let oldValue:
            | Record<string, unknown>
            | Record<string, unknown>[]
            | null = null;
          let newValue: Record<string, unknown> | unknown = null;
          let resourceId: string = "bulk_operation";

          // Casteamos args de forma segura hacia nuestra estructura conocida
          const typedArgs = args as QueryArgs;

          // Extraemos el delegado del modelo dinámicamente de forma segura
          const delegate = db[
            model as keyof typeof db
          ] as unknown as PrismaDelegate;

          // Capturar 'oldValue'
          if (
            ["update", "delete", "upsert"].includes(operation) &&
            typedArgs.where
          ) {
            oldValue = await delegate.findUnique({ where: typedArgs.where });
          } else if (
            ["updateMany", "deleteMany"].includes(operation) &&
            typedArgs.where
          ) {
            oldValue = await delegate.findMany({ where: typedArgs.where });
          }

          // Ejecutar mutación interceptada
          const result = await query(args);

          // Capturar 'newValue'
          if (operation === "delete" || operation === "deleteMany") {
            newValue = null;
          } else if (["create", "update", "upsert"].includes(operation)) {
            newValue = result;
          } else if (operation === "updateMany") {
            newValue = typedArgs.data ?? null;
          }

          // Asignar resourceId utilizando nuestro Type Guard estricto
          if (hasIdProperty(result)) {
            resourceId = String(result.id);
          } else if (
            oldValue &&
            !Array.isArray(oldValue) &&
            hasIdProperty(oldValue)
          ) {
            resourceId = String(oldValue.id);
          }

          // Registrar auditoría con tipos limpios (parseamos para forzar que sea JSON válido para Prisma)
          // await db.log.create({
          //   data: {
          //     userName: ctx.userName,
          //     userId: ctx.userId ?? null,
          //     action: operation,
          //     resource: model,
          //     resourceId,
          //     oldValue: oldValue ? JSON.parse(JSON.stringify(oldValue)) : null,
          //     newValue: newValue ? JSON.parse(JSON.stringify(newValue)) : null,
          //   },
          // });

          console.log(
            JSON.stringify(
              {
                userName: ctx.userName,
                userId: ctx.userId ?? null,
                action: operation,
                resource: model,
                resourceId,
                oldValue: oldValue
                  ? JSON.parse(JSON.stringify(oldValue))
                  : null,
                newValue: newValue
                  ? JSON.parse(JSON.stringify(newValue))
                  : null,
              },
              null,
              2,
            ),
          );

          return result;
        },
      },
    },
  });
