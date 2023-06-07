import { longtext, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const waitlist = mysqlTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email"),
  comment: longtext("comment"),
});
