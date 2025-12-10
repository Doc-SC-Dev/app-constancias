import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HistoryEntry } from "@/lib/types/history";

type DialogContentProps = {
  data: HistoryEntry;
  certName?: string;
};

export default function ViewDialog({data: user, certName}: DialogContentProps) {
  return (
    <DialogContent className="w-4xl">
      <DialogHeader className="px-8">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col gap-0">
            <DialogTitle>{certName}</DialogTitle>
            <Badge variant="secondary">{user.role}</Badge>
            {certName && (
              <div className="text-sm text-muted-foreground">{certName}</div>
            )}
          </div>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
