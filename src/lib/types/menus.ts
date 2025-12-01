import type { dynamicIconImports } from "lucide-react/dynamic";

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
  permissions?: Record<string, string[]>;
};

export const menus: Record<dashboards, Menu> = {
  home: {
    url: "/dashboard",
    icon: "home",
    name: "Inicio",
    description: "Página de inicio",
  },
  users: {
    name: "Usuarios",
    icon: "user",
    url: "/dashboard/users",
    description: "Dashboard de administración de usuarios",
    permissions: { user: ["list"] },
  },
  students: {
    name: "Estudiantes",
    icon: "users",
    url: "/dashboard/students",
    description: "Dashboard de administración de usuarios con rol estudiantes",
    permissions: { student: ["list"] },
  },
  history: {
    name: "Constancias",
    icon: "history",
    url: "/dashboard/history",
    description:
      "Dashboard de visualización de peticiones históricas de constancias",
    permissions: { history: ["list"] },
  },
  activities: {
    name: "Actividades",
    icon: "activity",
    url: "/dashboard/activities",
    description: "Dashboard de administración de actividades",
    permissions: { activity: ["list"] },
  },
};
