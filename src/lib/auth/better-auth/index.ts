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
  superadmin,
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
        required: true,
        input: true,
        returned: true,
      },
    },
  },
  plugins: [
    nextCookies(),
    admin({
      ac: ac,
      roles: { professor, guest, superadmin, student, administrator },
      adminRoles: ["admin", "superadmin"],
    }),
  ],
});
