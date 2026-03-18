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
import type { AcademicDegree } from "../../domain/AcademicDegree";
import { EditAcademicDegreeForm } from "./EditAcademicDegreeForm";

export function EditAcademicDegreeSheet({
  academicDegree,
}: {
  academicDegree: AcademicDegree;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="group flex items-center justify-center transition-all duration-300 ease-in-out hover:gap-2 gap-0 px-3 hover:px-4 "
          variant="ghost"
        >
          <Pencil className="h-4 w-4 shrink" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[150px] group-hover:opacity-100">
            Editar
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar grado académico</SheetTitle>
          <SheetDescription>
            Edita la información del grado académico con nombre{" "}
            <strong>{academicDegree.name}</strong>.
          </SheetDescription>
        </SheetHeader>
        <EditAcademicDegreeForm
          academicDegree={academicDegree}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
