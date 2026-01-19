"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import ActionDialogManager from "@/components/form/action-dialog-manager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { menus } from "@/lib/types/menus";
import type { User } from "@/lib/types/users";
import CreateActivityDialog from "../activity/_components/create-activity-dialog";
import NewUserDialog from "../users/_components/newuser-dialog";
import CreateRequestDialog from "./create-request-dialog";

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
        return <CreateRequestDialog user={user} />;
      case menus.activities.name:
        return <CreateActivityDialog closeDialog={() => {}} />;
      case menus.users.name:
        return <NewUserDialog />;
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
              Ir
            </Link>
          </Button>
        </CardTitle>
        <CardDescription className="on-hover:text-accent-foreground/10 text-md">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-end justify-center">
        <ActionDialogManager
          createDialog={selectDialog}
          triggerLabel={`Crear ${title}`}
          variant="ghost"
          className="text-sm"
        />
      </CardFooter>
    </Card>
  );
}
