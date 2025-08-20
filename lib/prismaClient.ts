import { PrismaClient } from "../app/generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prismaDB = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaDB;

// Next.js uses HOT RELOADING , because of that we need to create a new instance of PrismaClient on every request, to avoid it , we assigned the PrismaClient to a global variable to persist the PrismaClient instance in memory of variable without creating each time a new Prisma instance.
