import { FolderMinus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
//import CreateActivityDialog from "./create-activity-dialog";

export function ActivityEmpty() {
  return (
    <div className="h-full flex items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderMinus />
          </EmptyMedia>
          <EmptyTitle>No hay actividades</EmptyTitle>
          <EmptyDescription>
            No has creado actividad todavía. Empieza creando una nueva actividad
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  Crear actividad
                </Button>
              </DialogTrigger>
              {/* <CreateActivityDialog /> */}
            </Dialog>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
