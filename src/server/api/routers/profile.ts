import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../../db";
import { users } from "../../../schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

const upsertUser = createInsertSchema(users).merge(
  z.object({ experiences: z.array(z.any()), educations: z.array(z.any()) })
); // TODO: add zod schema for user
interface Experience {
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
}
export const profileRouter = createTRPCRouter({
  get: publicProcedure.input(z.string()).query(async ({ input }) => {
    const res = await db.select().from(users).where(eq(users.id, input));
    return {
      ...res[0],
      experiences: (res[0]?.experiences ?? []) as Experience[],
    };
  }),
  update: publicProcedure.input(upsertUser).mutation(async ({ input }) => {
    await Promise.all([
      db.insert(users).values(input).onDuplicateKeyUpdate({ set: input }),
    ]);
  }),
});
