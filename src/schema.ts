import {
  int,
  json,
  mysqlTable,
  text,
  longtext,
  timestamp,
  tinytext,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
  id: tinytext("id").primaryKey().notNull(),
  email: text("email").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  phone: text("phone").notNull(),
  tokens: int("token").notNull(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  experiences: json("experiences").notNull(),
  educations: json("educations").notNull(),
});
export const resumes = mysqlTable("resume", {
  id: int("int").primaryKey().autoincrement(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  jobDescription: longtext("jobDescription").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  experiences: json("experiences").notNull(),
  educations: json("educations").notNull(),
  coverLetter: longtext("coverLetter").notNull(),
});
