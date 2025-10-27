import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getClientById } from "@/features/clients/actions";
import { ClientCard } from "@/features/clients/components/client-card";

interface ClientDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const client = await getClientById(params.id);
  if (client) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link href="/clients">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Client Details</h1>
          <p className="text-muted-foreground">
            View and manage client information
          </p>
        </div>

        <ClientCard client={client} />
      </div>
    );
  } else notFound();
}
