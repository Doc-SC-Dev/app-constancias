enum dashboards {
  HOME = "home",
  USERS = "users",
  HISTORY = "history",
  STUDENTS = "students",
  ACTIVITY = "activities",
}
export type Menu = {
  name: string;
  icon: string;
  url: string;
  description: string;
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
  },
  students: {
    name: "Estudiantes",
    icon: "users",
    url: "/dashboard/students",
    description: "Dashboard de Administración de usuarios con rol estudiantes",
  },
  history: {
    name: "Historial",
    icon: "history",
    url: "/dashboard/history",
    description:
      "Dashboard de visualización de peticiones historicas de constancias",
  },
  activities: {
    name: "Actividades",
    icon: "activity",
    url: "/dashboard/activities",
    description: "Dashboard de administración de actividades",
  },
};
