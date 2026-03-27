import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Role } from "@/generated/prisma";
import { auth, isAuthenticated } from "@/lib/auth";
import { isAdmin } from "@/lib/authorization/permissions";
import { HistoryClient } from "./_components/history-client";
import { HistoryTableSkeleton } from "./_components/history-table-skeleton";
import {
  OtherTableWrapper,
  StandardTableWrapper,
} from "./_components/history-tables";

export default async function HistoryPage() {
  const { user } = await isAuthenticated();

  const { success } = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permissions: {
        request: ["list"],
      },
    },
  });

  if (!success) {
    return redirect("/dashboard");
  }

  const userRole = user.role as Role;
  const adminMode = isAdmin(userRole);

  return (
    <div className="container h-full mx-auto">
      <HistoryClient
        isAdmin={adminMode}
        user={user}
        standardTable={
          <Suspense fallback={<HistoryTableSkeleton />}>
            <StandardTableWrapper user={user} isAdmin={adminMode} />
          </Suspense>
        }
        otherTable={
          <Suspense fallback={<HistoryTableSkeleton />}>
            <OtherTableWrapper user={user} isAdmin={adminMode} />
          </Suspense>
        }
      />
    </div>
  );
}
