export interface UserEntity {
  id: string;
  name: string;
  email: string;
  rut: string;
  role: "SUPERADMIN" | "ADMINISTRATOR" | "PROFESSOR" | "STUDENT";
  gender: "MALE" | "FEMALE" | "OTHER";
  academicDegree?: string;
  title?: string;
  isDirector: boolean;
  image?: string | null;
  banned: boolean | null;
}
