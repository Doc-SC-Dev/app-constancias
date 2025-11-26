import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import {
  ac,
  administrator,
  guest,
  professor,
  student,
  superadmin,
} from "@/lib/authorization/permissions";
import { sendForgotPasswordEmail } from "@/lib/email/resend";
import { db } from "../../db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user: { email, name }, url }) => {
      await sendForgotPasswordEmail(email, name, url);
    },
  },
  user: {
    additionalFields: {
      rut: {
        type: "string",
        required: true,
        input: true,
        returned: true,
        unique: true,
      },
    },
  },
  plugins: [
    nextCookies(),
    admin({
      ac: ac,
      roles: { professor, guest, superadmin, student, administrator },
      adminRoles: ["administrator", "superadmin"],
    }),
  ],
});
