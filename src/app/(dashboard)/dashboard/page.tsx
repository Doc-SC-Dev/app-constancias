import { menus } from "@/lib/types/menus";
import { DashboardCard } from "./_components/dashboard-card";

export default function HomePage() {
  const cardData = Object.values(menus).filter(
    (menu) => menu.name !== "Inicio",
  );
  return (
    <div className="grid grid-cols-2 gap-4">
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
  );
}
