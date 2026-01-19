import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { isAuthenticated } from "@/lib/auth";
import { menus } from "@/lib/types/menus";
import { getRequestsTypes } from "../action";
import { DashboardCard } from "./_components/dashboard-card";

export default async function HomePage() {
  const session = await isAuthenticated();
  const { user } = session;

  const cardData = Object.values(menus).filter(
    (menu) => menu.name !== "Inicio",
  );
  const isAdmin = ["ADMINISTRATOR", "SUPERADMIN"].includes(user.role as string);
  const permissions: Record<string, boolean> = {
    Usuarios: isAdmin,
    Estudiantes: isAdmin,
    Constancias: true,
    Actividades:
      isAdmin || ["professor", "guest"].includes(user.role as string),
  };
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["certificate-types"],
    queryFn: getRequestsTypes,
  });

  return (
    <div className="h-full w-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accesos Rápido</h1>
      </div>
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {cardData.map((card) => {
            if (!permissions[card.name]) return null;
            return (
              <DashboardCard
                key={card.name}
                title={card.name}
                description={card.description}
                icon={card.icon}
                url={card.url}
                user={user}
              />
            );
          })}
        </HydrationBoundary>
      </div>
    </div>
  );
}
