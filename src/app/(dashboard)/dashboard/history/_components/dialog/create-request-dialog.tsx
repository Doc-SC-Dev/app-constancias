"use client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User } from "@/lib/types/users";
import { verifyAcademicPeriod } from "../../actions";
import CreateRequestForm from "../form/create-request-form";

export default function CreateRequestDialog({ user }: { user: User }) {
  const { data: academicPeriod } = useQuery({
    queryKey: ["verify-academic-period"],
    queryFn: verifyAcademicPeriod,
  });
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={!academicPeriod?.active}>
          <Plus />
          Crear Solicitud
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear solicitud de Constancia</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear una nueva solicitud de constancia.
          </DialogDescription>
        </DialogHeader>
        <CreateRequestForm setOpen={setOpen} user={user} />
      </DialogContent>
    </Dialog>
  );
}
