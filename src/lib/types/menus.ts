import type { dynamicIconImports } from "lucide-react/dynamic";
import type { Permissions } from "./permissions";

enum dashboards {
  HOME = "home",
  USERS = "users",
  HISTORY = "history",
  STUDENTS = "students",
  ACTIVITY = "activities",
}
export type Menu = {
  name: string;
  icon: keyof typeof dynamicIconImports;
  url: string;
  description: string;
  permissions: Permissions;
};

export const menus: Record<dashboards, Menu> = {
  home: {
    url: "/dashboard",
    icon: "home",
    name: "Inicio",
    description: "Página de inicio.",
    permissions: {},
  },
  users: {
    name: "Usuarios",
    icon: "user",
    url: "/dashboard/users",
    description: "Dashboard de administración de usuarios.",
    permissions: { user: ["list"] },
  },
  students: {
    name: "Estudiantes",
    icon: "users",
    url: "/dashboard/students",
    description: "Dashboard de administración de usuarios con rol estudiantes.",
    permissions: { user: ["list"] },
  },
  history: {
    name: "Constancias",
    icon: "history",
    url: "/dashboard/history",
    description:
      "Dashboard de visualización de peticiones históricas de constancias.",
    permissions: { request: ["list"] },
  },
  activities: {
    name: "Actividades",
    icon: "activity",
    url: "/dashboard/activities",
    description:
      "Dashboard de administración de actividades tales como proyectos de investigación, tesis o catedras.",
    permissions: { activity: ["list"] },
  },
};
