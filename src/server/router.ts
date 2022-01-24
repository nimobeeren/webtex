import * as trpc from "@trpc/server";
import { z } from "zod";
import { Context } from "./context";

export const appRouter = trpc
  .router<Context>()
  .query("projects", {
    resolve({ ctx }) {
      return ctx.db.project.findMany({
        select: {
          id: true,
          title: true
        }
      });
    }
  })
  .query("project", {
    input: z.object({ id: z.string() }),
    resolve({ ctx, input }) {
      return ctx.db.project.findUnique({
        where: {
          id: input.id
        },
        rejectOnNotFound: true
      });
    }
  });

export type AppRouter = typeof appRouter;
