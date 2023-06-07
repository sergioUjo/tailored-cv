import { connect } from "@planetscale/database";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/planetscale-serverless";
const connection = connect({
  url: process.env.DATABASE_URL as string,
});

const db = drizzle(connection);

await migrate(db as any, { migrationsFolder: "drizzle" });
console.log("migrations complete");
