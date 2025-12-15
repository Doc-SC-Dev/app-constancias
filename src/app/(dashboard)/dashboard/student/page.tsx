import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { auth, isAuthenticated } from "@/lib/auth";
import type { PaginationResponse } from "@/lib/types/pagination";
import type { Student } from "@/lib/types/students";
import { columns } from "./_components/columns";
import { listStudents } from "./action";

export default async function UsersPage() {
  const session = await isAuthenticated();
  const permission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { user: ["list"] },
    },
  });
  if (!permission.success) {
    redirect("/dashboard");
  }

  const queryClient = new QueryClient();

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
      <DataTable<Student>
        columns={columns}
        queryKey="list-students"
        queryFn={listStudents}
        placeholder="Filtrar por matricula, nombre o email"
      >
        {""}
      </DataTable>
    </HydrationBoundary>
  );
}
