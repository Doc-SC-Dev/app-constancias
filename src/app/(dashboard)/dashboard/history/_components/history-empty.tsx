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
import CreateRequestDialog from "../../_components/create-request-dialog";

export function HistoryEmpty() {
  return (
    <div className="h-full flex items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderMinus />
          </EmptyMedia>
          <EmptyTitle>No hay constancias</EmptyTitle>
          <EmptyDescription>
            No se han generado constancias aún.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  Solicitar constancia
                </Button>
              </DialogTrigger>
              <CreateRequestDialog />
            </Dialog>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
