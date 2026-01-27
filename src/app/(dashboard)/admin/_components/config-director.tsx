import { AlertTriangle, Edit } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/generated/prisma";
import { db } from "@/lib/db";

export default async function ConfigDirector() {
  const director = await db.user.findFirst({
    where: {
      isDirector: {
        equals: true,
      },
    },
  });
  if (!director) {
    return <ConfigDirectorError />;
  }
  return <ConfigDirectorContent director={director} />;
}

function ConfigDirectorContent({ director }: { director: User }) {
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-4 items-center gap-10">
        <Avatar className="w-20 h-20">
          <AvatarImage src={director.image ?? ""} />
          <AvatarFallback className="text-3xl">
            {director.name.at(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <p className="text-2xl">{director.name}</p>
          <p className="text-lg">{director.email}</p>
        </div>
      </div>
      <div className="flex flex-1 justify-items-start">
        <Button size="lg" variant="outline">
          <Edit />
          Cambiar
        </Button>
      </div>
    </div>
  );
}

function ConfigDirectorError() {
  return (
    <div className="flex items-center">
      <Alert variant="default" className=" w-1/2">
        <AlertTriangle className="fill-amber-400" />
        <AlertTitle>No se a configurado un director</AlertTitle>
        <AlertDescription>
          Seleccione a un usuario para configurarlo como Directo del programa
        </AlertDescription>
      </Alert>
    </div>
  );
}
export function ConfigDirectorLoading() {
  return (
    <div className="flex items-center">
      <div className="container mx-auto flex items-center gap-10">
        <div className="flex w-fit items-center gap-4">
          <Skeleton className="size-20 shrink-0 rounded-full bg-gray-300" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-[150] bg-gray-300" />
          <Skeleton className="h-2 w-[150] bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
