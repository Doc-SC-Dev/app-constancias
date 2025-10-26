import type { ClientInput, ClientFilterInput, ClientUpdateInput } from "@/lib/validations/client";

export type Client = {
    id: string;
    businessName: string;
    taxId: string;
    contactName: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: "active" | "inactive" | "suspended";
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string | null;
};

export type ClientWithRelations = Client & {
    createdByUser?: {
        id: string;
        name: string;
        email: string;
    };
    updatedByUser?: {
        id: string;
        name: string;
        email: string;
    } | null;
};

export type ClientFormData = ClientInput;
export type ClientListFilters = ClientFilterInput;
export type ClientUpdateData = ClientUpdateInput;

export type ClientListResult = {
    clients: Client[];
    totalCount: number;
    hasMore: boolean;
};
