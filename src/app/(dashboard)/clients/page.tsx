import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClientForm } from "@/features/clients/components/client-form";
import { ClientList } from "@/features/clients/components/client-list";
import type { Client } from "@/features/clients/types";

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleViewClient = (client: Client) => {
    // For now, just show the edit form
    // In a real app, you might want a separate view mode
    setEditingClient(client);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client information and contacts
          </p>
        </div>
        <Button onClick={handleCreateClient}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {showForm ? (
        <div className="mb-6">
          <ClientForm client={editingClient} onSuccess={handleFormSuccess} />
        </div>
      ) : (
        <ClientList
          onEditClient={handleEditClient}
          onViewClient={handleViewClient}
        />
      )}
    </div>
  );
}
