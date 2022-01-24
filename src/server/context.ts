import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

const db = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"]
});

export const createContext = async ({
  req,
  res
}: trpcNext.CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching
  return {
    req,
    res,
    db
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
