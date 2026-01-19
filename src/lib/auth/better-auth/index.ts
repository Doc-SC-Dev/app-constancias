import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import {
  ADMINISTRATOR,
  ac,
  PROFESSOR,
  STUDENT,
  SUPERADMIN,
} from "@/lib/authorization/permissions";
import { db } from "@/lib/db";
import { sendForgotPasswordEmail } from "@/lib/email/resend";

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
      academicGrade: {
        type: "string",
        input: true,
        returned: true,
      },
      gender: {
        default: "FEMALE",
        required: true,
        type: "string",
        input: true,
        returned: true,
      },
    },
  },
  plugins: [
    nextCookies(),
    admin({
      ac: ac,
      roles: { PROFESSOR, SUPERADMIN, STUDENT, ADMINISTRATOR },
      adminRoles: ["ADMINISTRATOR", "SUPERADMIN"],
      defaultRole: "STUDENT",
    }),
  ],
  trustedOrigins: ["http://localhost:3000"],
});
