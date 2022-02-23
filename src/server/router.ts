import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { Context } from "./context";

export const appRouter = trpc
  .router<Context>()
  .transformer(superjson)
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
    async resolve({ ctx, input }) {
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.id
        }
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND"
        });
      }

      return project;
    }
  })
  .mutation("updateProject", {
    input: z.object({
      id: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      bibliography: z.string().optional()
    }),
    resolve({ ctx, input }) {
      return ctx.db.project.update({
        where: {
          id: input.id
        },
        data: {
          title: input.title,
          content: input.content,
          bibliography: input.bibliography
        }
      });
    }
  });

export type AppRouter = typeof appRouter;
