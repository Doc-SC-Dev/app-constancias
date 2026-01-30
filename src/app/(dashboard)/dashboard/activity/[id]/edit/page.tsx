import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
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
  const { isSuccess, error, value } = await getActivityById(id);
  if (isSuccess)
    return (
      <ActivityEditForm
        data={value}
        title={<h1 className="text-xl">{value?.name}</h1>}
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
              {value?.type.replace(/_/g, " ")}
            </Badge>
          </>
        }
      />
    );
  // TODO: Show error to the user
  return redirect("/dashboard/activity");
}
