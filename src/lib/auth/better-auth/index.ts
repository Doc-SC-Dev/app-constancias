import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import {
  ac,
  admin as administrator,
  guest,
  professor,
  student,
  sub_admin,
} from "@/lib/authorization/permissions";
import { db } from "../../db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      rut: {
        type: "string",
        defaultValue: "",
        input: true,
      },
    },
  },
  plugins: [
    nextCookies(),
    admin({
      ac: ac,
      roles: { professor, guest, sub_admin, student, administrator },
    }),
  ],
});
