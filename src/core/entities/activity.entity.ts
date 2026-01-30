export interface ActivityEntity {
  id: string;
  name: string;
  type: string;
  startAt: Date;
  endAt?: Date | null;
  nParticpants: number;
  participants: {
    id: string;
    name: string;
    rol: string;
    rolRequied: boolean;
    hours: number;
  }[];
}
