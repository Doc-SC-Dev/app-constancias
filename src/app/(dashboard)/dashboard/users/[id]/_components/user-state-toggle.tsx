"use client";

import { DotIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { userStateChange } from "../../actions";

type UserStateTaggleProps = {
  banned: boolean;
  id: string;
};

export default function UserStateToggle({ banned, id }: UserStateTaggleProps) {
  const [inactive, setInactive] = useState<boolean>(banned);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = async () => {
    setIsLoading(true);
    const newBanned = await userStateChange(id, banned);
    setInactive(newBanned);
    setIsLoading(false);
  };
  return (
    <Toggle
      pressed={inactive}
      onPressedChange={handleChange}
      size="default"
      variant="outline"
      disabled={isLoading}
      className="data-[state=off]:bg-green-300 data-[state=on]:bg-red-300 data-[state=off]:text-green-700 data-[state=on]:text-red-700 data-[state=off]:border-green-500 data-[state=on]:border-red-500"
    >
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <DotIcon />
          {inactive ? "Desactivo" : "Activo"}
        </>
      )}
    </Toggle>
  );
}
