import { useEffect } from "react";
import type { Role } from "@/lib/authorization/permissions";
import type { ActivityCreateDTO } from "@/lib/types/activity";

type ActivityType = {
  participantTypes: {
    max: number | null;
    min: number;
    name: string;
    id: string;
    roles: Role[];
    minCapacity: number;
    maxCapacity: number | null;
  }[];
  name: string;
  id: string;
};

export function useParticipantConstraints({
  activityType,
  activityTypes,
  replaceParticipants,
  watchedParticipants,
}: {
  activityType: string;
  activityTypes: ActivityType[] | undefined;
  replaceParticipants: (value: ActivityCreateDTO["participants"]) => void;
  watchedParticipants: ActivityCreateDTO["participants"];
}) {
  const selectedActivityType = activityTypes?.find(
    (t) => t.id === activityType,
  );

  const countByType = (typeId: string, excludeIndex?: number): number =>
    watchedParticipants.filter(
      (p, i) => p.type === typeId && i !== excludeIndex,
    ).length;

  const isTypeAtMax = (typeId: string, excludeIndex?: number): boolean => {
    const pType = selectedActivityType?.participantTypes.find(
      (pt) => pt.id === typeId,
    );
    if (!pType) return false;
    const max = pType.max;
    if (!max || max <= 0) return false;
    return countByType(typeId, excludeIndex) >= max;
  };

  const allTypesAtMax: boolean =
    !!selectedActivityType &&
    selectedActivityType.participantTypes.length > 0 &&
    selectedActivityType.participantTypes.every((pt) => isTypeAtMax(pt.id));

  useEffect(() => {
    if (!activityType) {
      replaceParticipants([]);
      return;
    }

    const activityConfig = activityTypes?.find(
      (aType) => aType.id === activityType,
    );
    if (activityConfig) {
      const initialParticipants = activityConfig.participantTypes
        .filter((p) => p.min > 0)
        .flatMap<ActivityCreateDTO["participants"][0]>((p) =>
          Array.from({ length: p.min }, () => ({
            id: "",
            type: p.id,
            hours: 0,
            bloqueado: true,
          })),
        );
      replaceParticipants(initialParticipants);
    }
  }, [activityType, replaceParticipants, activityTypes]);

  return { selectedActivityType, isTypeAtMax, allTypesAtMax };
}
