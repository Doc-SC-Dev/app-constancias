import { getActivityById } from "../actions";
import ActivityDetailContent from "./_components/ActivityDetailContent";

export default async function ActivityViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getActivityById(id);
  
  return (
    <div className="h-full w-full">
      <ActivityDetailContent data={data} />
    </div>
  );
}
