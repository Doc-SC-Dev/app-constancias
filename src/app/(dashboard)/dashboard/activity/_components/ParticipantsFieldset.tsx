// _components/participants-fieldset.tsx

import { Plus } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import { TableError } from "@/components/form/table-error";
import { Button } from "@/components/ui/button";
import {
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ActivityCreateDTO } from "@/lib/types/activity";
import type { User } from "@/lib/types/users";
import { ParticipantRow } from "./ParticipantRow";

type ParticipantType = {
  id: string;
  name: string;
  max: number | null;
  min: number;
};

type ParticipantsFieldSetProps = {
  participants: ActivityCreateDTO["participants"] & { id: string }[];
  participantTypes: ParticipantType[];
  users: User[] | undefined;
  isLoadingUsers: boolean;
  allTypesAtMax: boolean;
  activityTypeSelected: boolean;
  errors: FieldErrors[] | undefined;
  isTypeAtMax: (typeId: string, excludeIndex: number) => boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function ParticipantsFieldSet({
  participants,
  participantTypes,
  users,
  isLoadingUsers,
  allTypesAtMax,
  activityTypeSelected,
  errors,
  isTypeAtMax,
  onAdd,
  onRemove,
}: ParticipantsFieldSetProps) {
  return (
    <FieldSet className="w-full">
      <div className="flex justify-between gap-2 items-center">
        <FieldContent>
          <FieldLegend variant="label" className="mb-0">
            Participantes
          </FieldLegend>
          <FieldDescription>
            Ingresar los participantes de la actividad y su rol
          </FieldDescription>
        </FieldContent>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!activityTypeSelected || allTypesAtMax}
          onClick={onAdd}
        >
          <Plus />
          Agregar
        </Button>
      </div>
      <FieldGroup>
        <TableError errors={errors} />
        {participants.length > 0 && (
          <div className="max-h-[200px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, index) => (
                  <ParticipantRow
                    key={`tr-${participant.id}`}
                    index={index}
                    participantId={participant.id}
                    bloqueado={participant.bloqueado}
                    users={users}
                    isLoadingUsers={isLoadingUsers}
                    participantTypes={participantTypes}
                    isTypeAtMax={isTypeAtMax}
                    onRemove={onRemove}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </FieldGroup>
    </FieldSet>
  );
}
