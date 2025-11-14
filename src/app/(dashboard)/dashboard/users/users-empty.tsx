import { ArrowUpRightIcon, FolderMinus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function UsersEmpty() {
  return (
    <div className="h-full flex items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderMinus />
          </EmptyMedia>
          <EmptyTitle>No hay usuarios</EmptyTitle>
          <EmptyDescription>
            No has creado usuario todavia. Empieza creando un nuevo usuario
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>
              <Plus />
              Crear usuario
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
