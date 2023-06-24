import { db } from "./db";
import { users } from "../schema";
import { type Profile } from "../utils/types";
import { eq } from "drizzle-orm";
const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  title: "",
  description: "",
  email: "",
  phone: "",
  tokens: 50000,
  experiences: [],
  educations: [],
};
export async function retrieveProfile(userId: string): Promise<Profile> {
  const res = await db.select().from(users).where(eq(users.id, userId));
  const profile = res[0];
  if (!profile) {
    return {
      ...DEFAULT_PROFILE,
      id: userId,
    };
  }
  return profile as Profile;
}

export async function saveProfile(input: Profile) {
  await db.insert(users).values(input).onDuplicateKeyUpdate({ set: input });
}

export async function decreaseProfileTokens(profile: Profile, amount: number) {
  console.log("decreasing profile tokens", amount);
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
