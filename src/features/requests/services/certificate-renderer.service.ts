import type { CertificateTemplate } from "@/generated/prisma";
import type { FullRequest } from "../types/request.types";

export function resolveTemplatePath(obj: unknown, path: string): string {
  if (!path.length) return path;

  // Handle ternary: path == value ? truthy : falsy
  const ternaryMatch = path.match(
    /^(.+?)\s*==\s*(.+?)\s*\?\s*(.+?)\s*:\s*(.+)$/,
  );
  if (ternaryMatch) {
    const [, condPath, condValue, truthy, falsy] = ternaryMatch;
    const resolvedCondValue = resolveSinglePath(obj, condPath.trim());
    return String(resolvedCondValue) === condValue.trim()
      ? truthy.trim()
      : falsy.trim();
  }

  // Handle space separated paths
  const subPaths = path.trim().split(/\s+/);
  if (subPaths.length > 1) {
    return subPaths.map((p) => resolveSinglePath(obj, p)).join(" ");
  }

  return resolveSinglePath(obj, path);
}

function resolveSinglePath(obj: unknown, path: string): string {
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return "";
    current = (current as Record<string, unknown>)[part];
  }
  return current !== null && current !== undefined ? String(current) : "";
}

export function renderTemplate(
  template: string,
  context: Record<string, unknown>,
): string {
  return template.replace(/\{(.+?)\}/g, (_, path) => {
    try {
      return resolveTemplatePath(context, path);
    } catch (e) {
      console.warn(`Failed to resolve path: ${path}`, e);
      return "";
    }
  });
}

export function selectTemplate(
  templates: CertificateTemplate[],
  request: FullRequest,
  participantTypeId?: string,
): CertificateTemplate | null {
  // Case 1: Role-based
  const roleTemplate = templates.find(
    (t) =>
      t.role !== null &&
      t.activityTypeId === null &&
      t.participantTypeId === null,
  );
  if (roleTemplate) {
    return templates.find((t) => t.role === request.user.role) || null;
  }

  // Case 2: Activity-type-based
  if (request.activity) {
    const activityTemplate = templates.find(
      (t) =>
        t.activityTypeId !== null &&
        t.role === null &&
        t.participantTypeId === null,
    );

    if (activityTemplate) {
      return (
        templates.find(
          (t) => t.activityTypeId === request.activity?.activityType.id,
        ) || null
      );
    }

    // Case 3: Participant-type-based
    const participantEnvMatch =
      participantTypeId ||
      request.activity.participants.find((p) => p.user.id === request.user.id)
        ?.type.id;
    if (participantEnvMatch) {
      const participantTemplate = templates.find(
        (t) =>
          t.participantTypeId !== null &&
          t.role === null &&
          t.activityTypeId === null,
      );
      if (
        participantTemplate &&
        participantTemplate.participantTypeId === participantEnvMatch
      ) {
        return participantTemplate;
      }
    }
  }

  return null;
}
