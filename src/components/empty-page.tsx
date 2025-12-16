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

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  createDialog?: React.ComponentType<{ closeDialog: () => void }>;
};
export function EmptyPage({
  title,
  description,
  createDialog: CreateDialog,
  buttonLabel,
}: Props) {
  return (
    <div className="h-full flex items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderMinus />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  {buttonLabel}
                </Button>
              </DialogTrigger>
              {CreateDialog && <CreateDialog closeDialog={() => {}} />}
            </Dialog>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  ); 
}
