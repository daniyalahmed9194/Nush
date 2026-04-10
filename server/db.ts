import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Enable TLS when using Supabase pooler URLs which require SSL.
  // This sets `rejectUnauthorized: false` to allow connections when the
  // environment or platform does not provide a CA bundle.
  ssl: process.env.DATABASE_URL?.includes("supabase")
    ? { rejectUnauthorized: false }
    : undefined,
});

// Prevent unhandled 'error' events from crashing the process.
pool.on("error", (err) => {
  // Log and keep the process running; callers should handle query errors.
  // If needed, add monitoring/alerts here.
  // eslint-disable-next-line no-console
  console.error("Unexpected error on idle PostgreSQL client", err);
});

export const db = drizzle(pool, { schema });
