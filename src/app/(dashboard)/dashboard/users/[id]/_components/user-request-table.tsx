"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Dot } from "lucide-react";
import { LazyDataTable } from "@/components/dynamic-table";
import { Badge } from "@/components/ui/badge";
import type { RequestState } from "@/generated/prisma";
import type { UserRequest } from "@/lib/types/request";
import { formatDate, Textos } from "@/lib/utils";
import { listUserRequest } from "../../actions";

const getBadgeColor = (state: RequestState) => {
  switch (state) {
    case "PENDING":
      return { bg: "amber-100", fg: "amber-800" };
    case "APPROVED":
    case "READY":
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
    cell: (data) => formatDate(data.getValue<Date>()),
  },
];

export default function UserRequestTable({ userId }: { userId: string }) {
  return (
    <LazyDataTable
      columns={columns}
      queryFn={({ pageParam }) => listUserRequest({ pageParam, userId })}
      queryKey="list-user-request"
      placeholder="Filtrar Peticiones"
      emptyTitle="El usuario no ha realizado peticiones aún"
      emptyDescription="Para poder ver las peticiones, primero espere a que el usuario realice una petición"
      containerClassName="flex-1"
    />
  );
}
