import { FolderMinus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useState } from "react";

type Props = {
  title: string;
  description?: string;
  buttonLabel?: string;
  createDialog?: React.ComponentType<{ closeDialog: () => void }>;
};
export function EmptyPage({
  title,
  description,
  createDialog: CreateDialog,
  buttonLabel,
}: Props) {
  const [open, setOpen] = useState(false);
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
            <div className="flex gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus />
                    {buttonLabel}
                  </Button>
                </DialogTrigger>
                <CreateDialog closeDialog={() => setOpen(false)} />
              </Dialog>
            </div>
          </EmptyContent>
        )}
      </Empty>
    </div>
  );
}
