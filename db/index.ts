import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// On récupère l'URL depuis les variables d'environnement
const sql = neon(process.env.DATABASE_URL!);

// On initialise Drizzle avec le schéma
export const db = drizzle(sql, { schema });
