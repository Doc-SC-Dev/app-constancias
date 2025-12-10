import { Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ActivityEmpty() {
  return (
    <div className="h-full flex items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Activity />
          </EmptyMedia>
          <EmptyTitle>No hay actividades</EmptyTitle>
          <EmptyDescription>
            No participas en ninguna actividad aún.
          </EmptyDescription>
        </EmptyHeader>
        {/* 
          If we had a "Join Activity" or "Create Activity" action, it would go here.
          For now, leaving it empty or we could add a button if there's a relevant action.
          History has "Solicitar constancia". Maybe "Ver actividades disponibles"?
        */}
        {/* <EmptyContent>
          <Button>
            <Plus />
            Unirse a actividad
          </Button>
        </EmptyContent> */}
      </Empty>
    </div>
  );
}
