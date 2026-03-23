import { notFound } from "next/navigation";
import type { ActivityType } from "@/features/activity-type/domain/ActivityType";
import { getActivityTypeByIdAction } from "@/features/activity-type/presentation/actions";
import ActivityTypeDetailContent from "@/features/activity-type/presentation/components/activity-type-detail-content";

export default async function ActivityTypeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getActivityTypeByIdAction(id);

  if (!result.isSuccess || !result.value) {
    return notFound();
  }

  return (
    <ActivityTypeDetailContent activityType={result.value as ActivityType} />
  );
}
