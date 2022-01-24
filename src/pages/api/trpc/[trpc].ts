import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

const db = new PrismaClient();

const appRouter = trpc
  .router()
  .query("projects", {
    resolve() {
      return db.project.findMany({
        select: {
          id: true,
          title: true
        }
      });
    }
  })
  .query("project", {
    input: z.object({ id: z.string() }),
    async resolve(req) {
      await new Promise(resolve => setTimeout(resolve, 3000))
      return db.project.findUnique({
        where: {
          id: req.input.id
        },
        rejectOnNotFound: true
      });
    }
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null
});
