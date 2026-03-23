"use client";

import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Edit,
  Trash,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Activity } from "@/lib/types/activity";
import { formatDate } from "@/lib/utils";
import DeleteDialog from "../../_components/delete-dialog";
import AddParticipantSheet from "./AddParticipantSheet";
import RemoveParticipantAlertDialog from "./RemoveParticipantAlertDialog";

export default function ActivityDetailContent({ data }: { data: Activity }) {
  const [participantToRemove, setParticipantToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className="flex flex-col md:h-full md:min-h-0 gap-6">
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/activity">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/activity/${data.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Eliminar Actividad</Button>
            </AlertDialogTrigger>
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
          </AlertDialog>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tipo de Actividad
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.type.replace(/_/g, " ")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Categoría asignada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periodo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {formatDate(data.startAt)}
              {data.endAt && ` - ${formatDate(data.endAt)}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-balance">
              Duración de la actividad
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.participants.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de integrantes
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="flex-1 md:min-h-0">
        <Card className="md:h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Participantes</CardTitle>
              <CardDescription>
                Listado de personas que participan en esta actividad.
              </CardDescription>
            </div>
            <AddParticipantSheet
              activityId={data.id}
              activityTypeId={data.typeId}
              existingParticipantIds={data.participants.map((p) => p.userId)}
            />
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {data.participants.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 m-6 rounded-lg border border-dashed">
                <Users className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No hay participantes</h3>
                <p className="text-sm text-muted-foreground">
                  Aún no se han agregado participantes a esta actividad.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-32rem)] py-4">
                <ItemGroup className="divide-y px-6">
                  {data.participants.map((participant) => (
                    <Item
                      key={participant.userId}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <ItemContent className="py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex flex-col gap-1">
                            <ItemTitle className="font-bold text-base">
                              {participant.name}
                            </ItemTitle>
                            <div className="flex gap-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase font-bold text-[#008296] border-[#008296]"
                              >
                                {participant.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                Horas
                              </span>
                              <span className="font-mono font-bold text-[#005092]">
                                {participant.hours}
                              </span>
                            </div>
                          </div>
                        </div>
                      </ItemContent>
                      <ItemActions className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            setParticipantToRemove({
                              id: participant.id,
                              name: participant.name,
                            })
                          }
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </section>

      {participantToRemove && (
        <RemoveParticipantAlertDialog
          isOpen={!!participantToRemove}
          onOpenChange={(open) => !open && setParticipantToRemove(null)}
          participantId={participantToRemove.id}
          participantName={participantToRemove.name}
          activityId={data.id}
        />
      )}
    </div>
  );
}
