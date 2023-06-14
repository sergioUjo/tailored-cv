import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { users } from "../../../schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { type Experience, Profile } from "../../../utils/types";
import {
  generateDescription,
  rewriteEducationDescription,
  rewriteExperienceDescription,
} from "../langchain";

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
type UpsertUser = z.infer<typeof upsertUser>;
function saveProfile(input: UpsertUser) {
  return db.insert(users).values(input).onDuplicateKeyUpdate({ set: input });
}
async function updateProfileTokenUsage(profile: Profile, tokenUsage: number) {
  console.log(
    "updateProfileTokenUsage",
    tokenUsage,
    profile.tokens - tokenUsage
  );
  await saveProfile({
    ...profile,
    tokens: Math.max(profile.tokens - tokenUsage, 0),
  });
}
async function retrieveProfile(userId: string): Promise<Profile> {
  const res = await db.select().from(users).where(eq(users.id, userId));
  const profile = res[0];
  if (!profile) {
    throw new Error("Profile not found");
  }
  return {
    ...profile,
    experiences: (res[0]?.experiences ?? []) as Experience[],
    educations: (res[0]?.educations ?? []) as Experience[],
  };
}

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return retrieveProfile(input);
  }),
  update: protectedProcedure.input(upsertUser).mutation(async ({ input }) => {
    return saveProfile(input);
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
          (tokenUsage) => updateProfileTokenUsage(profile, tokenUsage)
        );
      }
      if (input.type === "experience" && profile.experiences[input.index]) {
        return rewriteExperienceDescription(
          input.jobDescription,
          profile.experiences[input.index]!,
          (tokenUsage) => updateProfileTokenUsage(profile, tokenUsage)
        );
      }
      if (input.type === "education" && profile.educations[input.index]) {
        return rewriteEducationDescription(
          input.jobDescription,
          profile.educations[input.index]!,
          (tokenUsage) => updateProfileTokenUsage(profile, tokenUsage)
        );
      }
    }),
});
