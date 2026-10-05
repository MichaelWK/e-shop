import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type GraphQLContext = {
  prisma: PrismaClient;
};

export function createContext(): GraphQLContext {
  return { prisma };
}
