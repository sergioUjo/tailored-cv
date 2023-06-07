import { createTRPCRouter, publicProcedure } from "./trpc";
import { z } from "zod";
import { insertWaitlist } from "../db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  waitlist: publicProcedure
    .input(
      z.object({ comment: z.optional(z.string()), email: z.string().email() })
    )
    .mutation(({ input }) => {
      return insertWaitlist(input.email, input.comment);
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
