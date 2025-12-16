export class ActivityModel {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly startAt: Date,
    readonly endAt: Date,
    readonly nParticipants: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly activityTypeId: string,
    readonly nAssistant: number | null,
    readonly activityType: {
      name: string;
    },
    readonly participants: {
      id: string;
      startAt: Date | null;
      endAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
      hours: number;
      userId: string;
      activityId: string;
      participantTypeId: string;
      user: {
        name: string;
      };
    }[],
  ) {}
}
