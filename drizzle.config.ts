import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Задайте DATABASE_URL вашей PostgreSQL-базы.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL },
});
