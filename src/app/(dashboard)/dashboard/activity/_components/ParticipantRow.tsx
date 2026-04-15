"use client";
import { Trash } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormSelect } from "@/components/form/FormSelect";
import { FormNumberInput } from "@/components/form/form-number-input";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ActivityCreateDTO } from "@/lib/types/activity";
import type { User } from "@/lib/types/users";
import { UserSelect } from "./user-select";

type ParticipantType = {
  id: string;
  name: string;
  min: number;
  max: number | null;
};

type ParticipantRowProps = {
  index: number;
  participantId: string;
  bloqueado: boolean;
  users: User[] | undefined;
  isLoadingUsers: boolean;
  participantTypes: ParticipantType[];
  isTypeAtMax: (typeId: string, excludeIndex: number) => boolean;
  onRemove: (index: number) => void;
};

export function ParticipantRow({
  index,
  participantId,
  bloqueado,
  users,
  isLoadingUsers,
  participantTypes,
  isTypeAtMax,
  onRemove,
}: ParticipantRowProps) {
  const { control } = useFormContext<ActivityCreateDTO>();
  return (
    <TableRow key={`tr-${participantId}`}>
      <TableCell>
        {isLoadingUsers && <Spinner />}
        {users && (
          <UserSelect
            index={index}
            fieldName="participants"
            users={users}
            control={control}
            hideError={true}
          />
        )}
      </TableCell>
      <TableCell>
        <FormSelect
          hideError={true}
          control={control}
          name={`participants.${index}.type`}
          disabled={bloqueado}
        >
          {participantTypes.map((participantType) => {
            const atMax = isTypeAtMax(participantType.id, index);
            return (
              <SelectItem
                value={participantType.id}
                key={participantType.id}
                disabled={atMax}
              >
                {participantType.min > 0 && <b className="text-red-500">*</b>}{" "}
                {participantType.name}
                {atMax && " (máx. alcanzado)"}
              </SelectItem>
            );
          })}
        </FormSelect>
      </TableCell>
      <TableCell>
        <FormNumberInput
          control={control}
          name={`participants.${index}.hours`}
          hideError={true}
        />
      </TableCell>
      <TableCell>
        {!bloqueado && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onRemove(index)}
            aria-label={`Remove Participant ${index + 1}`}
          >
            <Trash />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
