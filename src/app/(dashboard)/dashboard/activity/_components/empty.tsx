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

      </Empty>
    </div>
  );
}
