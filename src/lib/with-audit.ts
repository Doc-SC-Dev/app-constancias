import type { Result } from "@/shared/core/Result";
import { type AuditContext, auditStorage } from "./audit-storage";
import { isAuthenticated } from "./auth";

export async function withAudit<T, E>(
  fn: () => Promise<Result<T, E>>,
): Promise<Result<T, E>> {
  const { user, session } = await isAuthenticated();
  const context: AuditContext = {
    userId: user.id,
    userName: user.name,
    ipAddress: session.ipAddress || "unknown",
  };

  return auditStorage.run(context, fn);
}
