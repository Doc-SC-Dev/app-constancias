import { type Control, useWatch } from "react-hook-form";
import { FormSelect } from "@/components/form/FormSelect";
import { SelectItem } from "@/components/ui/select";
import type { User } from "@/lib/types/users";

type ControlType = {
  name: string;
  date: {
    to: Date | undefined;
    from: Date;
  };
  type: string;
  participants: {
    id: string;
    type: string;
    hours: number;
    bloqueado: boolean;
  }[];
};

type UserSelectProps = {
  index: number;
  users: User[];
  fieldName: keyof ControlType;
  control: Control<ControlType>;
};
export function UserSelect({
  index,
  users,
  fieldName,
  control,
  hideError,
}: UserSelectProps & { hideError?: boolean }) {
  const currentValues = useWatch({ control, name: fieldName });
  const selectedId = new Set(
    (
      currentValues as {
        id: string;
        type: string;
        hours: number;
      }[]
    )
      .map((p, idx: number) => {
        if (idx !== index) return p.id;
        return null;
      })
      .filter(Boolean),
  );
  return (
    <FormSelect
      control={control}
      name={`participants.${index}.id`}
      hideError={hideError}
    >
      {users.map((user) => {
        const isDisabled = selectedId.has(user.id);
        return (
          <SelectItem value={user.id} key={user.id} disabled={isDisabled}>
            {user.name}
          </SelectItem>
        );
      })}
    </FormSelect>
  );
}
