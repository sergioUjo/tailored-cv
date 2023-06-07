import { createTRPCRouter, publicProcedure } from "./trpc";
import { z } from "zod";

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
      return {
        greeting: `Hello ${input.email}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
