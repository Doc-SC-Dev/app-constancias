import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientForm } from "@/features/clients/components/client-form";

export default function NewClientPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/clients">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Client</h1>
        <p className="text-muted-foreground">Add a new client to your system</p>
      </div>

      <ClientForm />
    </div>
  );
}
