import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { resumes, users } from "../../../schema";
import { createInsertSchema } from "drizzle-zod";
import {
  generateCover,
  generateDescription,
  rewriteEducationDescription,
  rewriteExperienceDescription,
} from "../langchain";
import { createCheckoutSession } from "../../stripe";
import { retrieveProfile, saveProfile } from "../../profile";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { type Resume } from "../../../utils/types";

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
const upsertResume = createInsertSchema(resumes).merge(
  z.object({
    experiences: z.array(experience),
    educations: z.array(experience),
  })
);

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return retrieveProfile(ctx.auth.userId);
  }),
  update: protectedProcedure.input(upsertUser).mutation(async ({ input }) => {
    return saveProfile(input);
  }),
  resumes: createTRPCRouter({
    update: protectedProcedure
      .input(upsertResume)
      .mutation(async ({ input }) => {
        const v = await db
          .insert(resumes)
          .values(input)
          .onDuplicateKeyUpdate({ set: input });
        return parseInt(v.insertId);
      }),
    get: protectedProcedure.query(async ({ ctx }) => {
      const result = await db
        .select()
        .from(resumes)
        .where(eq(resumes.userId, ctx.auth.userId));
      return result;
    }),
    getById: protectedProcedure.input(z.number()).query(async ({ input }) => {
      const result = await db
        .select()
        .from(resumes)
        .where(eq(resumes.id, input));
      return result[0] as Resume;
    }),
    delete: protectedProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.delete(resumes).where(eq(resumes.id, input));
    }),
  }),
  buyTokens: protectedProcedure
    .input(z.enum(["sniffer", "hunter", "professional"]))
    .mutation(async ({ input, ctx }) => {
      return createCheckoutSession(ctx.auth.userId, input);
    }),
  aiWrite: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        index: z.number(),
        jobDescription: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const profile = await retrieveProfile(ctx.auth.userId);
      if (profile.tokens === 0) {
        throw new Error("No tokens left");
      }
      if (!profile) {
        throw new Error("Profile not found");
      }
      if (input.type === "description") {
        return generateDescription(input.jobDescription, profile);
      }
      const selectedExperience = profile.experiences[input.index];
      if (input.type === "experiences" && selectedExperience) {
        return rewriteExperienceDescription(
          input.jobDescription,
          selectedExperience,
          profile
        );
      }
      const selectedEducation = profile.educations[input.index];
      if (input.type === "educations" && selectedEducation) {
        return rewriteEducationDescription(
          input.jobDescription,
          selectedEducation,
          profile
        );
      }
      if (input.type === "coverLetter") {
        return generateCover(input.jobDescription, profile);
      }
    }),
});
