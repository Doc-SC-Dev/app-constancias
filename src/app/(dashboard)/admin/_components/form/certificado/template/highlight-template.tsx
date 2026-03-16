import type { FullRequest } from "@/lib/types/request";

export default function HightlightTemplate({
  template,
  activityRole,
}: {
  template: string;
  activityRole?: string | undefined;
}) {
  const example: FullRequest = {
    id: "1",
    user: {
      name: "Tomás Alonso Bravo Cañete",
      rut: "20.488.616-4",
      role: "STUDENT",
      gender: "MALE",
      participants: [{ type: { name: activityRole || "Organizador" } }],
      academicDegree: { title: [{ abbrev: "Dr." }] },
      student: {
        studentId: 2019435701,
        admisionDate: new Date("2019-03-03"),
      },
    },
    activity: {
      name: "Seminario de investigación",
      activityType: {
        name: "Seminario",
      },
      startAt: new Date("2022-12-12"),
      endAt: new Date("2022-12-13"),
      participants: [
        {
          hours: 2,
          type: { name: "Asistente" },
          user: {
            name: "Isidora Acevedo",
            academicDegree: {
              title: [{ abbrev: "Dra." }],
            },
            gender: "FEMALE",
          },
        },
      ],
    },
    certificate: {
      name: "Ejemplo de nombre de certificado",
    },
  };
  const parts = template.split(/(\{.*?\})/g);
  return (
    <div className="min-h-[250px] p-4 border rounded-md bg-white">
      <p className="text-base">
        {parts.map((part, index) => {
          if (part.startsWith("{") && part.endsWith("}")) {
            const path = part.slice(1, -1);

            const value = parseTurnary(path, example);

            return value !== undefined ? (
              <span
                key={`span-part-${index}-${path}`}
                className="text-yellow-800 bg-yellow-200 font-medium"
              >
                {String(value)}
              </span>
            ) : (
              part
            );
          }
          return part;
        })}
      </p>
    </div>
  );
}

function resolveByPath(path: string, obj: FullRequest): any {
  if (!path.length) return path;
  return path.split(".").reduce((acc: Record<string, any>, key: string) => {
    const match = key.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      return acc?.[match[1]]?.[Number(match[2])];
    }
    return acc?.[key];
  }, obj);
}

function parseTurnary(path: string, obj: FullRequest) {
  if (!path.length) return path;
  const ternaryMatch = path.match(
    /^(.+?)\s*==\s*(.+?)\s*\?\s*(.+?)\s*:\s*(.+)$/,
  );
  if (ternaryMatch) {
    const [, condPath, condValue, truthy, falsy] = ternaryMatch;
    const resolvedCondValue = resolveByPath(condPath, obj);
    return resolvedCondValue === condValue.trim()
      ? truthy.trim()
      : falsy.trim();
  }
  return resolveByPath(path, obj);
}
