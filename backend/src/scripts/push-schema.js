import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing in backend/.env");
}

const migrationsDir = path.resolve(process.cwd(), "drizzle");
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

const sql = neon(databaseUrl);

for (const migrationFile of migrationFiles) {
  const migrationPath = path.join(migrationsDir, migrationFile);
  const sqlText = fs.readFileSync(migrationPath, "utf8");
  const statements = sqlText
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    // Execute DDL statements sequentially for predictable setup.
    if (typeof sql.query === "function") {
      await sql.query(statement);
    } else {
      throw new Error("Neon client does not expose sql.query for raw statement execution.");
    }
  }

  console.log(`Applied schema from ${migrationPath}`);
}
