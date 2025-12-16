import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/lib/types/users";
import UserActivitiesTable from "./user-activities-table";

type DialogContentProps = {
  data: User;
};

export default function ViewDialog({ data: user }: DialogContentProps) {
  return (
    <DialogContent className="sm:max-w-4xl w-full">
      <DialogHeader className="px-8">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <DialogTitle>{user.name}</DialogTitle>
            <span className="text-sm/normal text-muted-foreground">
              {user.email}
            </span>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        </div>
      </DialogHeader>
      <div className="px-8 pb-8">
        <UserActivitiesTable userId={user.id} />
      </div>
    </DialogContent>
  );
}
