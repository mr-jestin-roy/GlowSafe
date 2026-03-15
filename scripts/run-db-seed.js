/**
 * Run all SQL files in src/Database/ in the correct order.
 * On Render, run via Start Command: npm run db:seed && npm run start
 * Requires DATABASE_URL in the environment (or in .env when run locally).
 */
import pg from "pg";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env") });

const DB_DIR = path.join(ROOT, "src", "Database");

const ORDER = [
  "australian_postcodes.sql",
  "users.sql",
  "dummy_tables.sql",
  "skinprofiles.sql",
  "prevention_tips.sql",
  "cancer_incidence_by_state.sql",
  "cancer_incidence_mortality_by_age_gender.sql",
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString,
    ssl: process.env.DATABASE_URL?.includes("render.com")
      ? { rejectUnauthorized: false }
      : false,
  });
  try {
    await client.connect();
    console.log("Connected to database. Running SQL files in order...");

    for (const file of ORDER) {
      const filePath = path.join(DB_DIR, file);
      const sql = await readFile(filePath, "utf8");
      console.log(`Running ${file}...`);
      await client.query(sql);
      console.log(`  Done: ${file}`);
    }

    console.log("All SQL files completed successfully.");
  } catch (err) {
    console.error("Error running SQL:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
