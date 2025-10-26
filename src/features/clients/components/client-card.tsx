"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, MapPin, Building, Calendar } from "lucide-react";

interface Client {
  id: string;
  businessName: string;
  taxId: string;
  contactName: string;
  email: string;
  phone: string | null;
  address: string | null;
  status: "active" | "inactive" | "suspended";
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
}

export function ClientCard({ client, onEdit }: ClientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {client.businessName}
            </CardTitle>
            <CardDescription>
              Tax ID: {client.taxId}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(client.status)}>
              {client.status}
            </Badge>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(client)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Contact:</span>
              <span>{client.contactName}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            
            {client.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{client.address}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created: {new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Updated: {new Date(client.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {client.notes && (
          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm mb-2">Notes</h4>
            <p className="text-sm text-muted-foreground">{client.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
