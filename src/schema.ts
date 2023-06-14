import { json, mysqlTable, text, tinytext, int } from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
  id: tinytext("id").primaryKey().notNull(),
  email: text("email").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  phone: text("phone").notNull(),
  tokens: int("token").notNull().default(0),
  description: text("description").notNull(),
  title: text("title").notNull(),
  experiences: json("experiences").notNull(),
  educations: json("educations").notNull(),
});
