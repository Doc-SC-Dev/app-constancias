import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActivityById } from "../../actions";
import ActivityEditForm from "./_components/activity-edit-form";

export default async function ActivityEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getActivityById(id);
  return (
    <ActivityEditForm
      data={data}
      title={<h1 className="text-xl">{data.name}</h1>}
      backTo={
        <Button asChild variant="ghost" size="icon-sm">
          <Link href={`/dashboard/activity/${id}`}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
          </Link>
        </Button>
      }
      type={
        <>
          <span className="font-medium text-sm text-muted-foreground">
            Tipo
          </span>
          <Badge variant="secondary" className="w-fit">
            {data.type.replace(/_/g, " ")}
          </Badge>
        </>
      }
    />
  );
}
