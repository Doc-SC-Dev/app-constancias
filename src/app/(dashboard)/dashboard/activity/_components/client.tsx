"use client";

import { DataTable } from "@/components/data-table";
import type { ParticipantActivity } from "@/lib/types/paricipant-activity";
import { columns } from "./activity-columns";

interface ActivityClientProps {
  data: ParticipantActivity[];
}

export default function ActivityClient({ data }: ActivityClientProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      placeholder="Filtrar por actividad..."
    >
      <></>
    </DataTable>
  );
}
