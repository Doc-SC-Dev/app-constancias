import { menus } from "@/lib/types/menus";
import { DashboardCard } from "./_components/dashboard-card";

export default function HomePage() {
  const cardData = Object.values(menus).filter(
    (menu) => menu.name !== "Inicio",
  );
  return (
    <div className="h-full flex flex-colum justify-center items-center">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {cardData.map((card) => (
          <DashboardCard
            key={card.name}
            title={card.name}
            description={card.description}
            icon={card.icon}
            url={card.url}
          />
        ))}
      </div>
    </div>
  );
}
