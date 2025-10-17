import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

export const db = new PrismaClient().$extends(withAccelerate());
