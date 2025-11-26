import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { menus } from "@/lib/types/menus";
import { getRequestsTypes } from "../action";
import { DashboardCard } from "./_components/dashboard-card";

export default async function HomePage() {
  const cardData = Object.values(menus).filter(
    (menu) => menu.name !== "Inicio",
  );

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["certificate-types"],
    queryFn: getRequestsTypes,
  });

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {cardData.map((card) => (
            <DashboardCard
              key={card.name}
              title={card.name}
              description={card.description}
              icon={card.icon}
              url={card.url}
            />
          ))}
        </HydrationBoundary>
      </div>
    </div>
  );
}
