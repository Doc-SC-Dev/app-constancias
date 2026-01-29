import type { Result } from "@/shared/core/Result";
import { type AuditContext, auditStorage } from "./audit-storage";
import { isAuthenticated } from "./auth";

export async function withAudit<T>(
  fn: () => Promise<ReturnType<Result<T, string>["serialize"]>>,
): Promise<ReturnType<Result<T, string>["serialize"]>> {
  const { user, session } = await isAuthenticated();
  const context: AuditContext = {
    userId: user.id,
    userName: user.name,
    ipAddress: session.ipAddress || "unknown",
  };

  return auditStorage.run(context, fn);
}
