import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  FileText,
  Hash,
  InfinityIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { Textos } from "@/lib/utils";
import type { ActivityType } from "../../domain/ActivityType";
import ActivityTypeEditDialog from "./ActivityTypeEditDialog";
import CreateParticipantTypeSheet from "./create-participant-type-sheet";
import DeleteActivityTypeAlertDialog from "./delete-activity-type-alert-dialog";
import ParticipantTypeActions from "./participant-type-actions";

interface ActivityTypeDetailContentProps {
  activityType: ActivityType;
}

export default function ActivityTypeDetailContent({
  activityType,
}: ActivityTypeDetailContentProps) {
  const stats = activityType._count || {
    participantTypes: 0,
    activities: 0,
    template: 0,
  };

  return (
    <div className="flex flex-col md:h-full md:min-h-0 gap-4">
      <section
        id="activity-type-detail-section-name"
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/activity-type">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {activityType.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <ActivityTypeEditDialog activityType={activityType} />
          <DeleteActivityTypeAlertDialog
            id={activityType.id}
            currentName={activityType.name}
          />
        </div>
      </section>

      <section
        id="activity-type-detail-section-stats-card"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tipo de participante
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{stats.participantTypes}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Configurados para este tipo de actividad
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividades</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{stats.activities}</div>
            <Link
              href={`/dashboard/activities?activityType=${activityType.id}`}
              className="text-xs text-muted-foreground mt-2 flex items-center hover:text-primary transition-colors"
            >
              Ver actividades <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plantillas Asociadas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.template}</div>
            <Link
              href={`/admin/certificates?activityType=${activityType.id}`}
              className="text-xs text-muted-foreground mt-2 flex items-center hover:text-primary transition-colors"
            >
              Ver plantillas <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section
        id="activity-type-detail-section-participant"
        className="flex-1 md:min-h-0"
      >
        <Card className="md:h-full flex flex-col">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Tipos de Participantes</CardTitle>
              <CardDescription>
                Reglas de participación que aplicarán a todas las actividades de
                este tipo
              </CardDescription>
            </div>
            <CreateParticipantTypeSheet activityTypeId={activityType.id} />
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {!activityType.participantTypes ||
            activityType.participantTypes.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg border border-dashed">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No hay participantes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Aún no has configurado reglas de participación para este tipo
                  de actividad.
                </p>
              </div>
            ) : (
              <ItemGroup className="divide-y border-t mt-4">
                <ScrollArea className="h-[calc(100vh-40rem)] px-6">
                  {activityType.participantTypes.map((participantType) => (
                    <Item
                      key={participantType.id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <ItemContent className="py-5 px-4 md:px-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Identidad y Estado */}
                          <div className="flex flex-col gap-1">
                            <ItemTitle className="font-bold text-lg">
                              {participantType.name}
                            </ItemTitle>
                            <div>
                              {participantType.min > 0 ? (
                                <Badge className="bg-[#fa5014] hover:bg-[#fa5014]/90 text-[10px] uppercase h-5 font-bold shadow-sm">
                                  Obligatorio
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[#008296] border-[#008296] text-[10px] uppercase h-5 font-medium"
                                >
                                  Opcional
                                </Badge>
                              )}
                            </div>
                          </div>
                          {/* Reglas de Negocio (Responsivo) */}
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mr-auto md:mr-0 md:ml-auto pr-4">
                            {/* Roles */}
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-[#009fdd]" />
                              <div className="flex flex-wrap gap-1">
                                {participantType.roles.map((role) => (
                                  <span
                                    key={role}
                                    className="bg-muted px-2 py-0.5 rounded-md text-[11px] font-medium border"
                                  >
                                    {
                                      Textos.Role[
                                        role as keyof typeof Textos.Role
                                      ]
                                    }
                                  </span>
                                ))}
                                {participantType.roles.length === 0 && (
                                  <span className="italic text-xs">
                                    Sin roles
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Capacidad */}
                            <div className="flex items-center gap-2 border-l pl-6 border-muted-foreground/20">
                              <div className="bg-[#008296]/10 p-1.5 rounded-full">
                                <Hash className="w-3.5 h-3.5 text-[#008296]" />
                              </div>
                              <div className="flex flex-col leading-none">
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                                  Cupo
                                </span>
                                <span className="font-mono font-bold text-[#005092] flex items-center gap-1">
                                  {participantType.max || (
                                    <InfinityIcon className="w-4 h-4" />
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ItemContent>

                      <ItemActions>
                        <ParticipantTypeActions
                          participantTypeId={participantType.id}
                          activityTypeId={activityType.id}
                          currentName={participantType.name}
                          currentRoles={participantType.roles}
                          currentMin={participantType.min}
                          currentMax={participantType.max}
                        />
                      </ItemActions>
                    </Item>
                  ))}
                </ScrollArea>
              </ItemGroup>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
