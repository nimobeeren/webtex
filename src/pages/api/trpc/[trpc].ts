import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

const prisma = new PrismaClient();

const appRouter = trpc.router().query("projects", {
  resolve() {
    return prisma.project.findMany({
      select: {
        id: true,
        title: true
      }
    });
  }
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null
});
