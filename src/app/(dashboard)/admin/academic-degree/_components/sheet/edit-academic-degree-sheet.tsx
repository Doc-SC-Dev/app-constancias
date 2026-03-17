"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { AcademicDegreeDto } from "../config-grades";
import EditAcademicDegreeForm from "../form/edit-academic-degree-form";

export default function EditAcademicDegreeSheet({
  academicDegree,
}: {
  academicDegree: AcademicDegreeDto;
}) {
  return (
    <Sheet>
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
        <EditAcademicDegreeForm academicDegree={academicDegree} />
      </SheetContent>
    </Sheet>
  );
}
