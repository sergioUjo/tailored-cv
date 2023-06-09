import { createTRPCRouter, publicProcedure } from "./trpc";
import { z } from "zod";
import { insertWaitlist } from "../db";
import { tellAJoke } from "../../utils/langchain";

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
const user = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
});
const profile = z.object({
  title: z.string(),
  description: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  linkedIn: z.string(),
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
  profile: publicProcedure.input(profile).mutation(({ input }) => {
    return input;
  }),
  gpt: publicProcedure.mutation(async () => {
    await tellAJoke();
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
