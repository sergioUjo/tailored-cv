import { json, mysqlTable, text, tinytext } from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
  id: tinytext("id").primaryKey(),
  email: text("email"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  phone: text("phone"),
  description: text("description"),
  title: text("title"),
  experiences: json("experiences"),
  educations: json("educations"),
});
