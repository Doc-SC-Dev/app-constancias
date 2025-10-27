// import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/auth-helpers";

export default async function DashboardPage() {
  await requireAuth();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al sistema de gestión de presupuestos de catering
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Clientes</h3>
          <p className="text-muted-foreground mb-4">
            Gestiona la información de tus clientes
          </p>
          <a href="/dashboard/clients" className="text-primary hover:underline">
            Ver clientes →
          </a>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Presupuestos</h3>
          <p className="text-muted-foreground mb-4">
            Crea y gestiona presupuestos para eventos
          </p>
          <a href="/dashboard/budgets" className="text-primary hover:underline">
            Ver presupuestos →
          </a>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Recetas</h3>
          <p className="text-muted-foreground mb-4">
            Administra tus recetas y cálculos de costos
          </p>
          <a href="/dashboard/recipes" className="text-primary hover:underline">
            Ver recetas →
          </a>
        </div>
      </div>
    </div>
  );
}
