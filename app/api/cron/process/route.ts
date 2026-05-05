import { NextResponse } from 'next/server';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

export const dynamic = 'force-dynamic';

// Initialisation d'OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Le "Mega-Prompt" via Zod : On décrit très précisément ce qu'on attend de l'IA
const schemaIA = z.object({
  est_hors_sujet: z
    .boolean()
    .describe(
      "Vrai si l'article NE PARLE PAS du tout d'Intelligence Artificielle (ex: avions, climatiseurs, etc.).",
    ),
  est_bloque_par_paywall: z
    .boolean()
    .describe(
      "Vrai si le texte s'arrête net, demande de s'abonner, ou est trop court pour être un article complet.",
    ),
  est_de_la_hype_sans_substance: z
    .boolean()
    .describe(
      "Vrai si c'est purement promotionnel, abus de superlatifs sans données techniques ou preuves.",
    ),
  score_curation: z
    .number()
    .int()
    .min(1)
    .max(10)
    .describe("Note de 1 à 10 sur l'importance de cette info pour la tech."),
  raison_rejet: z
    .string()
    .nullable()
    .describe(
      'Si hors-sujet, paywall ou hype : expliquer en 5 mots pourquoi. Sinon null.',
    ),
  titre_fr_factuel: z
    .string()
    .nullable()
    .describe(
      'Le titre traduit en français, neutre, factuel, sans putaclic. Null si rejeté.',
    ),
  resume_3_puces: z
    .array(z.string())
    .nullable()
    .describe(
      "Un tableau de 3 phrases strictes en français. 1: Ce qui est annoncé. 2: Comment ça marche. 3: L'impact. Null si rejeté.",
    ),
});

export async function GET(request: Request) {
  try {
    // 1. Sécurité Vercel
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    console.log('\n--- 🧠 DEBUT DU TRAITEMENT IA ---');

    // 2. Récupérer un petit lot d'articles (3 par 3 pour éviter les timeouts Vercel)
    const articlesEnAttente = await db
      .select()
      .from(articles)
      .where(eq(articles.statut, 'EN_ATTENTE'))
      .limit(3);

    if (articlesEnAttente.length === 0) {
      console.log('😴 Aucun article en attente.');
      return NextResponse.json({ message: 'Aucun article à traiter.' });
    }

    console.log(`🤖 ${articlesEnAttente.length} articles envoyés à l'IA...`);

    let traites = 0;

    // 3. Boucle de traitement
    for (const article of articlesEnAttente) {
      console.log(`\n🔗 Traitement de : ${article.urlOriginale}`);

      try {
        // A. Aspiration du contenu via Jina Reader
        const jinaResponse = await fetch(
          `https://r.jina.ai/${article.urlOriginale}`,
        );
        const contenuMarkdown = await jinaResponse.text();

        // Sécurité si le site bloque l'aspiration
        if (!contenuMarkdown || contenuMarkdown.length < 100) {
          console.log('❌ Impossible de lire le contenu.');
          await db
            .update(articles)
            .set({
              statut: 'ERREUR_API',
              raisonRejet: 'Contenu illisible ou bloqué',
            })
            .where(eq(articles.id, article.id));
          continue;
        }

        // B. L'appel au cerveau (OpenAI avec Structured Outputs)
        const completion = await openai.chat.completions.parse({
          model: 'gpt-4o-mini', // Très rapide et peu coûteux
          messages: [
            {
              role: 'system',
              content:
                "Tu es le rédacteur en chef impitoyable d'un agrégateur d'actualités francophone sur l'IA (nommé Sema). Ton but est de filtrer le bruit, rejeter la hype et les articles hors-sujet, et synthétiser l'information de manière ultra-factuelle et neutre.",
            },
            {
              role: 'user',
              content: `Lis cet article et remplis la structure JSON demandée :\n\n${contenuMarkdown.substring(0, 15000)}`,
              // On coupe à 15000 caractères pour ne pas exploser le budget tokens sur des articles géants
            },
          ],
          response_format: zodResponseFormat(schemaIA, 'analyse_article'),
        });

        const analyse = completion.choices[0].message.parsed;

        // C. Logique de décision (La Machine à États finale)
        if (!analyse) throw new Error('Réponse IA vide');

        if (
          analyse.est_hors_sujet ||
          analyse.est_bloque_par_paywall ||
          analyse.est_de_la_hype_sans_substance
        ) {
          console.log(`🗑️ REJETÉ : ${analyse.raison_rejet}`);
          await db
            .update(articles)
            .set({
              statut: 'REJETE_IA',
              raisonRejet: analyse.raison_rejet,
              scoreCuration: analyse.score_curation,
              dateTraitementIa: new Date(),
            })
            .where(eq(articles.id, article.id));
        } else {
          console.log(`✅ ACCEPTÉ : ${analyse.titre_fr_factuel}`);
          await db
            .update(articles)
            .set({
              statut: 'PUBLIE',
              titreTraduit: analyse.titre_fr_factuel,
              resumePuces: analyse.resume_3_puces,
              scoreCuration: analyse.score_curation,
              dateTraitementIa: new Date(),
            })
            .where(eq(articles.id, article.id));
        }

        traites++;
      } catch (e) {
        console.error("❌ Erreur pendant le traitement d'un article :", e);
        await db
          .update(articles)
          .set({ statut: 'ERREUR_API', raisonRejet: 'Erreur technique IA' })
          .where(eq(articles.id, article.id));
      }
    }

    console.log('\n--- 🏁 FIN DU TRAITEMENT ---');
    return NextResponse.json({ success: true, articlesTraites: traites });
  } catch (error) {
    console.error('❌ Erreur critique :', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
