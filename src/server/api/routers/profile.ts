import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "../../../schema";
import { createInsertSchema } from "drizzle-zod";
import {
  generateDescription,
  rewriteEducationDescription,
  rewriteExperienceDescription,
} from "../langchain";
import { createCheckoutSession } from "../../stripe";
import {
  decreaseProfileTokens,
  retrieveProfile,
  saveProfile,
} from "../../profile";

const experience = z.object({
  title: z.string(),
  company: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string(),
});
const upsertUser = createInsertSchema(users).merge(
  z.object({
    experiences: z.array(experience),
    educations: z.array(experience),
  })
);
export const profileRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return retrieveProfile(input);
  }),
  update: protectedProcedure.input(upsertUser).mutation(async ({ input }) => {
    return saveProfile(input);
  }),
  buyTokens: protectedProcedure
    .input(z.enum(["sniffer", "hunter", "professional"]))
    .mutation(async ({ input, ctx }) => {
      return createCheckoutSession(ctx.auth.userId, input);
    }),
  aiWrite: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.string(),
        index: z.number(),
        jobDescription: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const profile = await retrieveProfile(input.userId);
      if (profile.tokens === 0) {
        throw new Error("No tokens left");
      }
      if (!profile) {
        throw new Error("Profile not found");
      }
      if (input.type === "description") {
        return generateDescription(
          input.jobDescription,
          profile.description,
          profile.experiences,
          profile.educations,
          (tokenUsage) => decreaseProfileTokens(profile, tokenUsage)
        );
      }
      if (input.type === "experience" && profile.experiences[input.index]) {
        return rewriteExperienceDescription(
          input.jobDescription,
          profile.experiences[input.index]!,
          (tokenUsage) => decreaseProfileTokens(profile, tokenUsage)
        );
      }
      if (input.type === "education" && profile.educations[input.index]) {
        return rewriteEducationDescription(
          input.jobDescription,
          profile.educations[input.index]!,
          (tokenUsage) => decreaseProfileTokens(profile, tokenUsage)
        );
      }
    }),
});
