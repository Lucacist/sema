import { NextResponse } from "next/server";
import { db } from "@/db"; // Assure-toi que ce chemin correspond à ton fichier index.ts de Drizzle
import { sources, articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import Parser from "rss-parser";

// On force Next.js à exécuter cette route dynamiquement (pas de cache)
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // ÉTAPE 1 : Sécurité Vercel Cron (Automatique selon l'environnement)
    if (process.env.NODE_ENV === "production") {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    console.log("🚀 Lancement du Cron d'Ingestion...");

    // ÉTAPE 2 : Récupérer toutes les sources ACTIVES depuis NeonDB
    const sourcesActives = await db
      .select()
      .from(sources)
      .where(eq(sources.actif, true));

    if (sourcesActives.length === 0) {
      return NextResponse.json({
        message: "Aucune source active trouvée en base.",
      });
    }

    let articlesAjoutes = 0;

    // ÉTAPE 3 : Boucler sur chaque source pour récupérer le contenu
    for (const source of sourcesActives) {
      console.log(`📡 Traitement de la source : ${source.nom}`);

      if (source.urlFlux.includes("algolia.com")) {
        // -> LOGIQUE HACKER NEWS (API JSON)
        // On fera un fetch() standard ici
        console.log("C'est une API Hacker News");
      } else {
        // -> LOGIQUE RSS STANDARD (XML)
        const parser = new Parser();
        // const feed = await parser.parseURL(source.urlFlux);
        console.log("C'est un flux RSS classique");
      }
    }

    // ÉTAPE 4 : Réponse de succès
    return NextResponse.json({
      success: true,
      message: `Ingestion terminée. ${articlesAjoutes} nouveaux articles mis en file d'attente.`,
    });
  } catch (error) {
    console.error("❌ Erreur lors du Cron d'ingestion :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne" },
      { status: 500 },
    );
  }
}
