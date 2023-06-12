import { createTRPCRouter, publicProcedure } from "./trpc";
import { z } from "zod";
import { insertWaitlist } from "../db";
import { tellAJoke } from "../../utils/langchain";
import { profileRouter } from "./routers/profile";

const position = z.object({
  start: z.date(),
  end: z.optional(z.date()),
  description: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
});
const education = z.object({
  start: z.date(),
  end: z.optional(z.date()),
  description: z.string(),
  title: z.string(),
  school: z.string(),
});
const profile = z.object({
  title: z.string().optional(),
  description: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedIn: z.string().optional(),
  positions: z.array(position),
  educations: z.array(education),
});
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
  profile: profileRouter,
  gpt: publicProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ input }) => {
      return tellAJoke(input.description);
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
