import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ActivityClient from "./_components/client";
import { ActivityEmpty } from "./_components/empty";
import { ParticipantActivity } from "@/lib/types/paricipant-activity";
import { ActivityType, ParticipantType } from "@/generated/prisma";

export default async function ActivityPage() {
  const nextHeader = await headers();
  const session = await auth.api.getSession({
    headers: nextHeader,
  });

  if (!session) {
    redirect("/login");
  }

  const { success } = await auth.api.userHasPermission({
    headers: nextHeader,
    body: {
      permissions: {
        activity: ["list"],
      },
    },
  });

  if (!success) {
    return redirect("/dashboard");
  }

  const userRole = session.user.role || "guest";
  const isAdmin = userRole === "administrator" || userRole === "superadmin";

  const participants = await db.participant.findMany({
    where: isAdmin ? undefined : { userId: session.user.id },
    include: {
      activity: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!participants || participants.length === 0) {
    return <ActivityEmpty />;
  }

  const formattedData: ParticipantActivity[] = participants.map((p) => {
    const start = new Date(p.activity.startAt);
    const end = new Date(p.activity.endAt);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.round((diffMs % 3600000) / 60000);
    const durationString = `${diffHrs}h ${diffMins}m`;

    return {
      id: p.id,
      hours: durationString, // Overriding number type with string for display
      type: p.type as ParticipantType,
      activityName: p.activity.name,
      activityType: p.activity.activityType as ActivityType,
      userName: p.user.name,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      activity: p.activity,
    };
  });

  return (
    <div className="container mx-auto">
      <ActivityClient data={formattedData} />
    </div>
  );
}
