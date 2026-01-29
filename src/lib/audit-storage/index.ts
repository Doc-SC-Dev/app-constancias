import { AsyncLocalStorage } from "node:async_hooks";

export interface AuditContext {
  userId: string;
  userName: string;
  ipAddress: string;
}

export const auditStorage = new AsyncLocalStorage<AuditContext>();
