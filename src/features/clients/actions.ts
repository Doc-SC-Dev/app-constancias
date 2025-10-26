"use server";

import { db } from "@/db/drizzle";
import { client } from "@/db/schema";
import { clientSchema, clientUpdateSchema, clientFilterSchema } from "@/lib/validations/client";
import { requirePermission } from "@/lib/auth-helpers";
import { eq, and, or, like, desc, asc } from "drizzle-orm";

// Create a new client
export async function createClient(data: typeof clientSchema.infer) {
  const session = await requirePermission("client", "create");
  
  const validatedData = clientSchema(data);
  
  const [newClient] = await db
    .insert(client)
    .values({
      ...validatedData,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    })
    .returning();
  
  return newClient;
}

// Get all clients with filtering and pagination
export async function getClients(filters: typeof clientFilterSchema.infer = {}) {
  await requirePermission("client", "read");
  
  const validatedFilters = clientFilterSchema(filters);
  const { search, status, limit = 50, offset = 0 } = validatedFilters;
  
  let query = db.select().from(client);
  
  // Apply filters
  const conditions = [];
  
  if (search) {
    conditions.push(
      or(
        like(client.businessName, `%${search}%`),
        like(client.contactName, `%${search}%`),
        like(client.email, `%${search}%`),
        like(client.taxId, `%${search}%`)
      )
    );
  }
  
  if (status) {
    conditions.push(eq(client.status, status));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  // Apply pagination and ordering
  const clients = await query
    .orderBy(desc(client.createdAt))
    .limit(limit)
    .offset(offset);
  
  // Get total count for pagination
  const totalCount = await db
    .select({ count: client.id })
    .from(client)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  
  return {
    clients,
    totalCount: totalCount.length,
    hasMore: offset + limit < totalCount.length,
  };
}

// Get a single client by ID
export async function getClientById(id: string) {
  await requirePermission("client", "read");
  
  const [clientRecord] = await db
    .select()
    .from(client)
    .where(eq(client.id, id))
    .limit(1);
  
  if (!clientRecord) {
    throw new Error("Client not found");
  }
  
  return clientRecord;
}

// Update a client
export async function updateClient(id: string, data: typeof clientUpdateSchema.infer) {
  const session = await requirePermission("client", "update");
  
  const validatedData = clientUpdateSchema(data);
  
  const [updatedClient] = await db
    .update(client)
    .set({
      ...validatedData,
      updatedBy: session.user.id,
    })
    .where(eq(client.id, id))
    .returning();
  
  if (!updatedClient) {
    throw new Error("Client not found");
  }
  
  return updatedClient;
}

// Delete a client
export async function deleteClient(id: string) {
  await requirePermission("client", "delete");
  
  const [deletedClient] = await db
    .delete(client)
    .where(eq(client.id, id))
    .returning();
  
  if (!deletedClient) {
    throw new Error("Client not found");
  }
  
  return deletedClient;
}
