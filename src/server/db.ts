import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../env.mjs";

// create the connection
const connection = connect({
  url: env.DATABASE_URL,
});
//emaljo573@gmail.com

export const db = drizzle(connection);
