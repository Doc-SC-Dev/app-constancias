"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type ClientInput, clientSchema } from "@/lib/validations/client";
import { createClient, updateClient } from "../actions";
import type { Client } from "../types";

interface ClientFormProps {
  client?: Client;
  onSuccess?: () => void;
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientInput>({
    defaultValues: client
      ? {
          businessName: client.businessName,
          taxId: client.taxId,
          contactName: client.contactName,
          email: client.email,
          phone: client.phone || "",
          address: client.address || "",
          status: client.status,
          notes: client.notes || "",
        }
      : {
          businessName: "",
          taxId: "",
          contactName: "",
          email: "",
          phone: "",
          address: "",
          status: "active",
          notes: "",
        },
  });

  const onSubmit = async (data: ClientInput) => {
    setIsSubmitting(true);
    try {
      if (client) {
        await updateClient(client.id, data);
        toast.success("Client updated successfully");
      } else {
        await createClient(data);
        toast.success("Client created successfully");
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{client ? "Edit Client" : "Create New Client"}</CardTitle>
        <CardDescription>
          {client
            ? "Update client information"
            : "Add a new client to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="client-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="businessName">Business Name *</FieldLabel>
              <Input
                {...form.register("businessName", {
                  required: "Business name is required",
                })}
                id="businessName"
                placeholder="Acme Corporation"
              />
              {form.formState.errors.businessName && (
                <FieldError errors={[form.formState.errors.businessName]} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="taxId">Tax ID *</FieldLabel>
              <Input
                {...form.register("taxId", { required: "Tax ID is required" })}
                id="taxId"
                placeholder="123456789"
              />
              {form.formState.errors.taxId && (
                <FieldError errors={[form.formState.errors.taxId]} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="contactName">Contact Name *</FieldLabel>
              <Input
                {...form.register("contactName", {
                  required: "Contact name is required",
                })}
                id="contactName"
                placeholder="John Doe"
              />
              {form.formState.errors.contactName && (
                <FieldError errors={[form.formState.errors.contactName]} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email *</FieldLabel>
              <Input
                {...form.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                id="email"
                type="email"
                placeholder="john@acme.com"
              />
              {form.formState.errors.email && (
                <FieldError errors={[form.formState.errors.email]} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                {...form.register("phone")}
                id="phone"
                placeholder="+1 (555) 123-4567"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                {...form.register("address")}
                id="address"
                placeholder="123 Main St, City, State 12345"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <select
                {...form.register("status")}
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <textarea
                {...form.register("notes")}
                id="notes"
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Additional notes about the client..."
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" form="client-form" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : client
                ? "Update Client"
                : "Create Client"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
