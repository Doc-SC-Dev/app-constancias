import type { CertificateTemplate } from "@/generated/prisma";
import type { FullRequest } from "../types/request.types";

export function resolveTemplatePath(obj: unknown, path: string): string {
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return "";
    current = (current as Record<string, unknown>)[part];
  }
  return current !== null && current !== undefined ? String(current) : "";
}

export function renderTemplate(template: string, context: Record<string, unknown>): string {
  return template.replace(/\{([\w.\[\]]+)\}/g, (_, path) => {
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
  participantTypeId?: string
): CertificateTemplate | null {
  // Case 1: Role-based
  const roleTemplate = templates.find(t => t.role !== null && t.activityTypeId === null && t.participantTypeId === null);
  if (roleTemplate && roleTemplate.role === request.user.role) {
    return roleTemplate;
  }

  // Case 2: Activity-type-based
  if (request.activity) {
    const activityTemplate = templates.find(t => t.activityTypeId !== null && t.role === null && t.participantTypeId === null);
    if (activityTemplate && activityTemplate.activityTypeId === request.activity.activityType.id) {
      return activityTemplate;
    }

    // Case 3: Participant-type-based
    const participantEnvMatch = participantTypeId || request.activity.participants.find(p => p.user.id === request.user.id)?.type.id;
    if (participantEnvMatch) {
      const participantTemplate = templates.find(t => t.participantTypeId !== null && t.role === null && t.activityTypeId === null);
      if (participantTemplate && participantTemplate.participantTypeId === participantEnvMatch) {
         return participantTemplate;
      }
    }
  }

  return null;
}
