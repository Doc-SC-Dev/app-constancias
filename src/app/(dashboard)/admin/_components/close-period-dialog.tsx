"use client";

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AcademicPeriod } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import { updateAcademicPeriods } from "../actions";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function ClosePeriodDialog({ periods }: { periods: AcademicPeriod[] }) {
  const [open, setOpen] = useState(false);
  const [currStartDate, setCurrStartDate] = useState<Date | undefined>(periods[0]?.startDate);
  const [currEndDate, setCurrEndDate] = useState<Date | undefined>(periods[0]?.endDate);
  const [nextStartDate, setNextStartDate] = useState<Date | undefined>(periods[1]?.startDate);
  const [nextEndDate, setNextEndDate] = useState<Date | undefined>(periods[1]?.endDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setCurrStartDate(periods[0]?.startDate);
      setCurrEndDate(periods[0]?.endDate);
      setNextStartDate(periods[1]?.startDate);
      setNextEndDate(periods[1]?.endDate);
    }
  };

  const handleSubmit = async () => {
    if (!currStartDate || !currEndDate || !nextStartDate || !nextEndDate) {
      toast.error("Debes completar todas las fechas para ambos periodos.");
      return;
    }

    if (currStartDate >= currEndDate) {
      toast.error("La fecha de fin del primer periodo debe ser posterior a la fecha de inicio.");
      return;
    }

    if (nextStartDate >= nextEndDate) {
      toast.error("La fecha de inicio del segundo periodo debe ser anterior a su cierre.");
      return;
    }

    if (currEndDate >= nextStartDate) {
      toast.error("El segundo periodo debe iniciar al menos un día después del cierre del primero.");
      return;
    }

    setIsSubmitting(true);
    const result = await updateAcademicPeriods([
      { startDate: currStartDate, endDate: currEndDate },
      { startDate: nextStartDate, endDate: nextEndDate }
    ]);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          <CalendarIcon className="mr-2" />
          Editar Periodos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Periodos Académicos</DialogTitle>
          <DialogDescription>
            Revisa o ingresa las fechas para los dos periodos correspondientes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="text-md font-semibold leading-none">Primer Periodo</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`justify-start text-left font-normal ${!currStartDate && "text-muted-foreground"
                        }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currStartDate ? formatDate(currStartDate) : <span>Seleccionar</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={currStartDate}
                      onSelect={setCurrStartDate}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Fecha de Cierre</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`justify-start text-left font-normal ${!currEndDate && "text-muted-foreground"
                        }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currEndDate ? formatDate(currEndDate) : <span>Seleccionar</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={currEndDate}
                      onSelect={setCurrEndDate}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold leading-none">Segundo Periodo</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`justify-start text-left font-normal ${!nextStartDate && "text-muted-foreground"
                        }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextStartDate ? formatDate(nextStartDate) : <span>Seleccionar</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={nextStartDate}
                      onSelect={setNextStartDate}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>Fecha de Cierre</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`justify-start text-left font-normal ${!nextEndDate && "text-muted-foreground"
                        }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextEndDate ? formatDate(nextEndDate) : <span>Seleccionar</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={nextEndDate}
                      onSelect={setNextEndDate}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
