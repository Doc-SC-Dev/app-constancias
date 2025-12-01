import type { statement } from "@/lib/authorization/permissions";

export type Entities = keyof typeof statement;
export type PermissionFor<E extends Entities> = (typeof statement)[E][number];
export type Permissions = typeof statement;
