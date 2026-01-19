import { QueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PaginationResponse } from "@/lib/types/pagination";
import type { UserActivityDTO } from "@/lib/types/paricipant-activity";
import type { UserRequest } from "@/lib/types/request";
import type { User } from "@/lib/types/users";
import { listUserActivities, listUserRequest } from "../../actions";
import UserActivitiesTable from "./user-activity-table";
import UserRequestTable from "./user-request-table";
import UserStateToggle from "./user-state-toggle";

export default async function UserCard({ user }: { user: User }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-user-request"],
    queryFn: ({ pageParam }) => listUserRequest({ userId: user.id, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<UserRequest>,
      groups: PaginationResponse<UserRequest>[],
    ) => groups.length,
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["list-user-activity"],
    queryFn: ({ pageParam }) =>
      listUserActivities({ userId: user.id, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<UserActivityDTO>,
      groups: PaginationResponse<UserActivityDTO>[],
    ) => groups.length,
  });

  return (
    <Card>
      <CardHeader className="justify-start">
        <Button variant="link" asChild>
          <Link href="/dashboard/users" className="flex items-center space-x-2">
            <ArrowLeftIcon className="h-4 w-4" />
            <p>Volver</p>
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="container flex flex-1 items-center justify-between mx-auto">
          <div className="flex gap-10">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback className="text-xl font-bold">
                {user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-3">
              <span className="flex items-center space-x-10">
                <CardTitle className="text-4xl">{user.name}</CardTitle>
                <Badge variant="secondary">{user.role}</Badge>
              </span>

              <span className="flex items-center space-x-3">
                <MailIcon className="w-4 h-4" />
                <p className="text-sm/normal text-muted-foreground">
                  {user.email}
                </p>
              </span>
            </div>
          </div>
          <div>
            <p className="text-md font-medium">Estado</p>
            <UserStateToggle banned={user.banned ?? false} id={user.id} />
          </div>
        </div>

        <div className="flex flex-col container mx-auto">
          <h3 className="text-lg font-semibold mb-4">Peticiones</h3>
          <UserRequestTable userId={user.id} />
        </div>
        <div className="flex flex-col container mx-auto">
          <h3 className="text-lg font-semibold mb-4">Actividades</h3>
          <UserActivitiesTable userId={user.id} />
        </div>
      </CardContent>
    </Card>
  );
}
