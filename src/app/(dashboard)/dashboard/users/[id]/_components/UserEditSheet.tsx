"use client";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UserWithAcademicDegree } from "@/lib/types/users";
import UserEditForm from "./UserEditForm";

export default function UserEditSheet({
  user,
}: {
  user: UserWithAcademicDegree;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar usuario</SheetTitle>
          <SheetDescription>Edita la información del usuario</SheetDescription>
        </SheetHeader>
        <UserEditForm user={user} closeSheet={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
