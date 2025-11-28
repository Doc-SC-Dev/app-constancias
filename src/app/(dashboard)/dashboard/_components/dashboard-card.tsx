"use client";
import { Plus } from "lucide-react";
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
import NewUserDialog from "../users/_components/newuser-dialog";
import CreateRequestDialog from "./create-request-dialog";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  url: string;
}

export function DashboardCard({ title, description, url }: DashboardCardProps) {
  const selectDialog: () => ReactNode = () => {
    switch (title) {
      case menus.students.name:
        return <></>;
      case menus.history.name:
        return <CreateRequestDialog />;
      case menus.activities.name:
        return <></>;
      case menus.users.name:
        return <NewUserDialog />;
      default:
        return <></>;
    }
  };
  return (
    <Card className=" max-h-sm min-w-2xs max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Button variant="link" asChild>
            <Link href={url}>Ir</Link>
          </Button>
        </CardTitle>
        <CardDescription className="on-hover:text-accent-foreground/10">
          {description}
        </CardDescription>
        <CardFooter className="flex items-center justify-center">
          <ActionDialogManager
            createDialog={selectDialog}
            triggerLabel={`Crear ${title}`}
            variant="ghost"
          />
        </CardFooter>
      </CardHeader>
    </Card>
  );
}
