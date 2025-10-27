"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientList } from "@/features/clients/components/client-list";

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client information and contacts
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <Link href="/clients/new">Add Client</Link>
        </Button>
      </div>

      <ClientList />
    </div>
  );
}
