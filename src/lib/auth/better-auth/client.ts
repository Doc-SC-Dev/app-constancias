import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
  ADMINISTRATOR,
  ac,
  PROFESSOR,
  STUDENT,
  SUPERADMIN,
} from "@/lib/authorization/permissions";
import type { auth } from ".";

const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: { ADMINISTRATOR, STUDENT, PROFESSOR, SUPERADMIN },
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
