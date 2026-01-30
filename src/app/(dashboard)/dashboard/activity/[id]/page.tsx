import { DialogTrigger } from "@radix-ui/react-dialog";
import { ArrowLeftIcon, Edit } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import DeleteDialog from "../_components/delete-dialog";
import { getActivityById } from "../actions";

export default async function ActivityViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { isSuccess, value: data, error } = await getActivityById(id);

  if (isSuccess)
    return (
      <Card className="h-full w-full">
        <div className="container mx-auto">
          <CardHeader className="flex items-center justify-between">
            <Button asChild variant="link" size="icon-sm">
              <Link href="/dashboard/activity">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="link" asChild>
                <span>
                  <Edit />
                  <Link href={`/dashboard/activity/${id}/edit`}>Editar</Link>
                </span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Eliminar</Button>
                </DialogTrigger>
                <DeleteDialog
                  data={{
                    activityType: data.type,
                    id: data.id,
                    name: data.name,
                    encargado: "",
                    startAt: data.startAt.toLocaleDateString("es-CL"),
                    endAt: data.endAt
                      ? data.endAt.toLocaleDateString("es-CL")
                      : undefined,
                    nParticipants: data.participants.length,
                  }}
                />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-6">
              <h1 className="text-xl">{data.name}</h1>
              <div className="flex gap-4">
                <span className="font-medium text-sm text-muted-foreground">
                  Tipo
                </span>
                <Badge variant="secondary" className="w-fit">
                  {data.type.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="flex gap-4">
                <span className="font-medium text-sm text-muted-foreground">
                  Periodo
                </span>
                <span className="text-sm">
                  {formatDate(data.startAt)}
                  {data.endAt && ` - ${formatDate(data.endAt)}`}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex flex-col flex-1 overflow-hidden">
              <span className="font-medium text-sm text-muted-foreground shrink-0">
                Participantes ({data.nParticpants})
              </span>
              <div className="flex-1 overflow-auto">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Horas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.participants.map((participant) => (
                        <TableRow key={participant.name}>
                          <TableCell>{participant.name}</TableCell>
                          <TableCell>{participant.rol}</TableCell>
                          <TableCell>{participant.hours}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  // TODO: introducir un elemento de error en caso de que vuelva con erro de action
  return redirect("dashboard/activity");
}
