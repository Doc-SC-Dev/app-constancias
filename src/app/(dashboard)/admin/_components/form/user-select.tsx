"use client";

import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { FormSelect } from "@/components/form/FormSelect";
import { SelectItem } from "@/components/ui/select";
import { getNonDirectorUsers } from "../../actions";
import type { NewDirector } from "./change-director-form";

type UserSelectProps = {
  label: string;
  description: string;
  disabled: boolean;
};
export default function UserSelect({ ...props }: UserSelectProps) {
  const { control } = useFormContext<NewDirector>();
  const { data } = useQuery({
    queryKey: ["get-non-director-users"],
    queryFn: getNonDirectorUsers,
  });
  return (
    <FormSelect control={control} name="userId" {...props}>
      {data?.map((user) => (
        <SelectItem value={user.id} key={user.id}>
          {user.name}
        </SelectItem>
      ))}
    </FormSelect>
  );
}
