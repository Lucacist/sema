import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sources, articles } from '@/db/schema';
import { eq, and, lt, sql } from 'drizzle-orm';
import Parser from 'rss-parser';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function genererHash(texte: string) {
  return crypto.createHash('sha256').update(texte).digest('hex');
}

export async function GET(request: Request) {
  try {
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    console.log("\n--- 🚀 DEBUT DU CRON D'INGESTION ---");

    const sourcesActives = await db
      .select()
      .from(sources)
      .where(eq(sources.actif, true));

    if (sourcesActives.length === 0) {
      console.log('⚠️ Aucune source active.');
      return NextResponse.json({ message: 'Aucune source active.' });
    }

    let totalTraites = 0;
    const parser = new Parser();

    for (const source of sourcesActives) {
      const urlPropre = source.urlFlux.trim();
      console.log(`\n📡 Source : [${source.nom.toUpperCase()}]`);

      if (urlPropre.includes('algolia.com')) {
        try {
          const reponse = await fetch(urlPropre);
          const data = await reponse.json();
          const hits = data.hits || [];
          console.log(`🔎 API Algolia : ${hits.length} articles trouvés.`);

          for (const hit of hits) {
            if (!hit.url) continue;

            const datePub = hit.created_at
              ? new Date(hit.created_at)
              : new Date();
            const ageEnHeures =
              (Date.now() - datePub.getTime()) / (1000 * 60 * 60);
            if (ageEnHeures > 24) {
              console.log(
                `   ⏭️ [Zappé - Trop vieux] ${hit.title.substring(0, 40)}...`,
              );
              continue;
            }

            const hash = genererHash(hit.url);
            const points = hit.points || 0;
            const statutInitial =
              points >= 50 ? 'EN_ATTENTE' : 'EN_OBSERVATION';

            // Log de détail pour Hacker News
            console.log(
              `   🔸 [HN] ${points} pts | ${hit.title.substring(0, 50)}...`,
            );

            await db
              .insert(articles)
              .values({
                sourceId: source.id,
                urlOriginale: hit.url,
                hashContenu: hash,
                statut: statutInitial,
                pointsHn: points,
                datePublicationOriginale: hit.created_at
                  ? new Date(hit.created_at)
                  : new Date(),
              })
              .onConflictDoUpdate({
                target: articles.hashContenu,
                set: {
                  pointsHn: points,
                  statut: sql`CASE 
                  WHEN articles.statut = 'EN_OBSERVATION' AND ${points} >= 50 THEN 'EN_ATTENTE'::statut_article 
                  ELSE articles.statut 
                END`,
                },
              });
            totalTraites++;
          }
        } catch (e) {
          console.error(`❌ Erreur Algolia:`, e);
        }
      } else {
        try {
          const feed = await parser.parseURL(urlPropre);
          console.log(`📖 RSS : ${feed.items.length} articles trouvés.`);

          for (const item of feed.items) {
            if (!item.link) continue;

            const datePub = item.pubDate ? new Date(item.pubDate) : new Date();
            const ageEnHeures =
              (Date.now() - datePub.getTime()) / (1000 * 60 * 60);
            if (ageEnHeures > 24) {
              console.log(
                `   ⏭️ [Zappé - Trop vieux] ${item.title?.substring(0, 40)}...`,
              );
              continue;
            }

            const hash = genererHash(item.link);

            // Log de détail pour RSS
            console.log(`   🔹 [RSS] ${item.title?.substring(0, 60)}...`);

            await db
              .insert(articles)
              .values({
                sourceId: source.id,
                urlOriginale: item.link,
                hashContenu: hash,
                statut: 'EN_ATTENTE',
                datePublicationOriginale: item.pubDate
                  ? new Date(item.pubDate)
                  : new Date(),
              })
              .onConflictDoNothing({ target: articles.hashContenu });
            totalTraites++;
          }
        } catch (e) {
          console.error(`❌ Erreur RSS:`, e);
        }
      }
    }

    console.log("\n🧹 Nettoyage de la file d'observation...");
    const ilYa24Heures = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const resultNettoyage = await db
      .update(articles)
      .set({ statut: 'IGNORE_SCORE_FAIBLE' })
      .where(
        and(
          eq(articles.statut, 'EN_OBSERVATION'),
          lt(articles.dateAjout, ilYa24Heures),
        ),
      );

    console.log('--- ✅ FIN DU CRON ---');

    return NextResponse.json({ success: true, articlesTraites: totalTraites });
  } catch (error) {
    console.error('❌ Erreur critique :', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
