import { db } from "./db";
import { users } from "../schema";
import { type Experience, type Profile } from "../utils/types";
import { eq } from "drizzle-orm";

export async function retrieveProfile(userId: string): Promise<Profile> {
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

export function saveProfile(input: Profile) {
  return db.insert(users).values(input).onDuplicateKeyUpdate({ set: input });
}

export async function decreaseProfileTokens(profile: Profile, amount: number) {
  await saveProfile({
    ...profile,
    tokens: Math.max(profile.tokens - amount, 0),
  });
}

export async function increaseProfileTokens(profile: Profile, amount: number) {
  await saveProfile({
    ...profile,
    tokens: profile.tokens + amount,
  });
}
