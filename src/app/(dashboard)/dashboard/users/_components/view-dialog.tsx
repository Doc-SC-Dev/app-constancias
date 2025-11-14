import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/lib/types/users";

type DialogContentProps = {
  user: User;
};

export default function ViewDialog({ user }: DialogContentProps) {
  return (
    <DialogContent className="w-4xl">
      <DialogHeader className="px-8">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <DialogTitle>{user.name}</DialogTitle>
            <span className="text-sm/normal text-muted-foreground">
              {user.email}
            </span>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
