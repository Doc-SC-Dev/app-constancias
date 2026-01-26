"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Dot } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import type { RequestState } from "@/generated/prisma";
import type { UserRequest } from "@/lib/types/request";
import { listUserRequest } from "../../actions";
import { Textos } from "@/lib/utils";

const getBadgeColor = (state: RequestState) => {
  switch (state) {
    case "PENDING":
      return { bg: "amber-100", fg: "amber-800" };
    case "APPROVED":
      return { bg: "green-100", fg: "green-800" };
    default:
      return { bg: "red-100", fg: "red-800" };
  }
};

const columns: ColumnDef<UserRequest>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: (data) => {
      const colors = getBadgeColor(data.getValue<RequestState>());
      return (
        <Badge
          variant="outline"
          className={`text-${colors.fg} bg-${colors.bg} border-${colors.fg}`}
        >
          <Dot />
          {Textos.State[data.getValue<string>()] || data.getValue<string>()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de emisión",
    cell: (data) => data.getValue<Date>().toLocaleDateString("es-CL"),
  },
];

export default function UserRequestTable({ userId }: { userId: string }) {
  return (
    <DataTable
      columns={columns}
      queryFn={({ pageParam }) => listUserRequest({ pageParam, userId })}
      queryKey="list-user-request"
      placeholder="Filtrar Peticiones"
      size="sm"
      emptyTitle="El usuario no a realizado peticiones aun"
      emptyDescription="Para poder ver las peticiones, primero espere a que el usuario realice una petición"
    >
      {""}
    </DataTable>
  );
}
