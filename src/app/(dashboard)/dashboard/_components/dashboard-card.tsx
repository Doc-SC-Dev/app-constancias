"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  LazyCreateActivityDialog,
  LazyCreateRequestDialog,
  LazyCreateUserDialog,
} from "@/components/dyamic-dialogs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Role } from "@/lib/authorization/permissions";
import { menus } from "@/lib/types/menus";
import type { User } from "@/lib/types/users";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  url: string;
  user: User;
}

export function DashboardCard({
  title,
  description,
  url,
  user,
}: DashboardCardProps) {
  const selectDialog: () => ReactNode = () => {
    switch (title) {
      case menus.students.name:
        return <></>;
      case menus.history.name:
        return <LazyCreateRequestDialog user={user} />;
      case menus.activities.name:
        return <LazyCreateActivityDialog />;
      case menus.users.name:
        return <LazyCreateUserDialog userRole={user.role as Role} />;
      default:
        return <></>;
    }
  };

  return (
    <Card className="h-lg  max-w-lg w-mid gap-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl">
          {title}
          <Button variant="link" asChild>
            <Link href={url} className="text-md">
              <ChevronRight />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription className="on-hover:text-accent-foreground/10 text-md">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-end justify-center">
        {selectDialog()}
      </CardFooter>
    </Card>
  );
}
