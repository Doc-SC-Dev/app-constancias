import { FolderMinus } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type Props = {
  title: string;
  description?: string;
  createDialog?: React.ComponentType;
};
export function EmptyPage({
  title,
  description,
  createDialog: CreateDialog,
}: Props) {
  return (
    <div className="h-full flex items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderMinus />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          {description && <EmptyDescription>{description}</EmptyDescription>}
        </EmptyHeader>
        {CreateDialog && (
          <EmptyContent>
            <div className="flex gap-2">{CreateDialog && <CreateDialog />}</div>
          </EmptyContent>
        )}
      </Empty>
    </div>
  );
}
