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
      genre: {
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
      roles: { professor, guest, superadmin, student, administrator },
      adminRoles: ["administrator", "superadmin"],
      defaultRole: "guest",
    }),
  ],
  trustedOrigins: ["http://localhost:3000"],
});
