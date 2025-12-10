"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Activity } from "@/lib/types/activity";

type DialogContentProps = {
  data: Activity;
};

export default function ViewDialog({ data: activity }: DialogContentProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{activity.name}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="text-right font-medium text-sm">Tipo:</span>
          <Badge variant="secondary" className="col-span-3 w-fit">
            {activity.activityType.replace(/_/g, " ")}
          </Badge>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="text-right font-medium text-sm">Inicio:</span>
          <span className="col-span-3 text-sm">
            {new Date(activity.startAt).toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="text-right font-medium text-sm">Fin:</span>
          <span className="col-span-3 text-sm">
            {new Date(activity.endAt).toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="text-right font-medium text-sm">Participantes:</span>
          <span className="col-span-3 text-sm">
            {activity.nParticipants}
          </span>
        </div>
      </div>
    </DialogContent>
  );
}
