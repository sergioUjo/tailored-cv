import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../env.mjs";
import { waitlist } from "../schema";

// create the connection
const connection = connect({
  url: env.DATABASE_URL,
});

const db = drizzle(connection);

export async function insertWaitlist(email: string, comment?: string) {
  const result = await db
    .insert(waitlist)
    .values({
      email: email,
      comment: comment,
    })
    .execute();
  return {
    id: result.insertId,
    email: email,
    comment: comment,
  };
}
