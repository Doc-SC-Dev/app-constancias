import { type } from "arktype";

// Client schemas
export const clientSchema = type({
    businessName: "string > 0",
    taxId: "string > 0",
    contactName: "string > 0",
    email: "string.email",
    phone: "string?",
    address: "string?",
    status: "'active' | 'inactive' | 'suspended' = 'active'",
    notes: "string?",
});

export const clientFilterSchema = type({
    search: "string?",
    status: "'active' | 'inactive' | 'suspended'?",
    limit: "number?",
    offset: "number?",
});

export const clientUpdateSchema = type({
    businessName: "string > 0?",
    taxId: "string > 0?",
    contactName: "string > 0?",
    email: "string.email?",
    phone: "string?",
    address: "string?",
    status: "'active' | 'inactive' | 'suspended'?",
    notes: "string?",
});

// Export types
export type ClientInput = typeof clientSchema.infer;
export type ClientFilterInput = typeof clientFilterSchema.infer;
export type ClientUpdateInput = typeof clientUpdateSchema.infer;
