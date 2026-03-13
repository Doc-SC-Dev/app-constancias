import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { auth, isAuthenticated } from "@/lib/auth";
import type { PaginationResponse } from "@/lib/types/pagination";
import { columns } from "./_components/columns";
import { listExams, type Exams } from "./actions";

export default async function ExamsPage() {
  const session = await isAuthenticated();

  const permission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { activity: ["list"] },
    },
  });
  if (!permission.success) {
    redirect("/dashboard");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-exams"],
    queryFn: ({ pageParam }) => listExams({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<Exams>,
      groups: PaginationResponse<Exams>[],
    ) => groups.length,
  });
  const isStudent = session.user.role === "STUDENT";
  const filteredColumns = isStudent
    ? columns.filter((col) => col.id !== "actions" && (col as any).accessorKey !== "actions")
    : columns;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container h-full mx-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Exámenes</h2>
        <DataTable<Exams>
          emptyTitle="No hay exámenes"
          emptyDescription="No hay exámenes registrados."
          columns={filteredColumns}
          queryKey="list-exams"
          queryFn={listExams}
          placeholder="Filtrar por actividad, usuario, notas"
        />
      </div>
    </HydrationBoundary>
  );
}
