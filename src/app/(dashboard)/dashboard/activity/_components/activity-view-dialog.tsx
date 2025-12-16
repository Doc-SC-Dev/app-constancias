"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Activity, type ActivityWithUser } from "@/lib/types/activity";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Participant } from "@/generated/prisma";

type DialogContentProps = {
  data: Activity | ActivityWithUser;
};

type ParticipantWithUser = Participant & {
  user: {
    name: string;
  };
};

const columns: ColumnDef<ParticipantWithUser>[] = [
  {
    accessorKey: "user.name",
    header: "Nombre",
  },
  {
    accessorKey: "type",
    header: "Rol",
    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          {row.original.type.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "hours",
    header: () => <div className="text-right w-full">Horas</div>,
    cell: ({ row }) => {
      return <div className="text-right w-full">{row.original.hours} hrs</div>;
    },
  },
];

export default function ViewDialog({ data: activity }: DialogContentProps) {
  const participants = "participants" in activity ? activity.participants : [];
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.type === "PROFESOR_ENCARGADO") return -1;
    if (b.type === "PROFESOR_ENCARGADO") return 1;
    return 0;
  });

  const queryFn = async () => {
    return {
      data: sortedParticipants,
      nextPage: 0,
      totalRows: sortedParticipants.length,
    };
  };

  return (
    <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{activity.name}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-6 py-4 h-full overflow-hidden">
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm text-muted-foreground">
              Tipo
            </span>
            <Badge variant="secondary" className="w-fit">
              {activity.activityType.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm text-muted-foreground">
              Periodo
            </span>
            <span className="text-sm">
              {new Date(activity.startAt).toLocaleDateString()} -{" "}
              {new Date(activity.endAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-3 flex flex-col flex-1 overflow-hidden">
          <span className="font-medium text-sm text-muted-foreground shrink-0">
            Participantes ({activity.nParticipants})
          </span>
          <div className="flex-1 overflow-hidden">
            <DataTable
              columns={columns}
              queryKey={`activity-${activity.id}-participants`}
              queryFn={queryFn}
              placeholder="Buscar participantes..."
            >
              <></>
            </DataTable>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
