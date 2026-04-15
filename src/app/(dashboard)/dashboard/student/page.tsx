import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { LazyDataTable } from "@/components/dynamic-table";
import { isAuthenticated } from "@/lib/auth";
import { isAdmin, type Role } from "@/lib/authorization/permissions";
import getQueryClient from "@/lib/query-client";
import type { PaginationResponse } from "@/lib/types/pagination";
import type { Student } from "@/lib/types/students";
import { columns } from "./_components/columns";
import { listStudents } from "./action";

export default async function UsersPage() {
  const session = await isAuthenticated();
  const adminUser = isAdmin(session.user.role as Role);
  if (!adminUser) {
    redirect("/dashboard");
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-students"],
    queryFn: ({ pageParam }) => listStudents({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<Student>,
      groups: PaginationResponse<Student>[],
    ) => groups.length,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container max-h-full mx-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Estudiantes</h2>
        <LazyDataTable<Student>
          emptyDescription="No hay estudiantes. Para iniciar debe crear un estudiante"
          emptyTitle="No hay estudiantes"
          columns={columns}
          queryKey="list-students"
          queryFn={listStudents}
          placeholder="Filtrar por matrícula, nombre o email"
          containerClassName="h-fit max-h-full"
        />
      </div>
    </HydrationBoundary>
  );
}
