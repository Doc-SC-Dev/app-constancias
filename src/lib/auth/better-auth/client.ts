import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
  ac,
  administrator,
  guest,
  professor,
  student,
  superadmin,
} from "@/lib/authorization/permissions";

const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: { administrator, guest, student, professor, superadmin },
    }),
  ],
});

export const { useSession, deleteUser, signIn, signUp, signOut, admin } =
  authClient;
type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      en: string;
      es: string;
    }
  >
>;
const errorCodes = {
  USER_ALREADY_EXISTS: {
    en: "user already registered",
    es: "usuario ya registrada",
  },
  ACCOUNT_NOT_FOUND: {
    en: "Account doesn't exists",
    es: "La cuenta no existe",
  },
  FAILED_TO_UPDATE_USER: {
    en: "User couldn't be updated",
    es: "El usuario no pudo ser actualizado",
  },
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: {
    en: "Your are not allowed to update users",
    es: "No tienes permisos para actualizar usuarios",
  },
  YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: {
    en: "Your are not allowd to delete users",
    es: "No tienes los permisos para eliminar usuarios",
  },
  USER_NOT_FOUND: {
    en: "The user does not exists",
    es: "El usuario no existe",
  },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, lang: "en" | "es") => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }
  return "";
};
