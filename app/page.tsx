import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArticleFeed } from '@/components/ArticleFeed';
import { SourceFilters } from '@/components/SourceFilters'; // NOUVEAU

export const dynamic = 'force-dynamic';

function calculerGravityScore(
  poidsSource: number,
  scoreCuration: number,
  datePublication: Date,
) {
  const G = 1.5;
  const maintenant = new Date().getTime();
  const datePub = new Date(datePublication).getTime();
  const ageEnHeures = Math.max(0, (maintenant - datePub) / (1000 * 60 * 60));
  return (poidsSource * scoreCuration) / Math.pow(ageEnHeures + 2, G);
}

// NOUVEAU : On récupère les searchParams depuis Next.js
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string }>;
}) {
  // On lit l'URL (Next.js 15+ nécessite d'attendre les params)
  const params = await searchParams;
  const rechercheTextuelle = params?.q?.toLowerCase() || '';
  const filtreSource = params?.source || '';

  const articlesPublies = await db.query.articles.findMany({
    where: eq(articles.statut, 'PUBLIE'),
    with: { source: true },
  });

  // 1. On calcule les scores et on trie
  let articlesClasses = articlesPublies
    .map((article) => {
      const scoreCur = article.scoreCuration || 5;
      const poids = article.source?.poidsSource || 1;
      const datePub = article.datePublicationOriginale || new Date();
      const gravityScore = calculerGravityScore(poids, scoreCur, datePub);
      return { ...article, gravityScore };
    })
    .sort((a, b) => {
      if (b.gravityScore !== a.gravityScore)
        return b.gravityScore - a.gravityScore;
      return (
        new Date(b.datePublicationOriginale || new Date()).getTime() -
        new Date(a.datePublicationOriginale || new Date()).getTime()
      );
    });

  // 2. EXTRAIRE LES SOURCES UNIQUES (Pour créer les boutons de filtre)
  const nomsDeSources = Array.from(
    new Set(articlesClasses.map((a) => a.source.nom)),
  );

  // 3. APPLIQUER LES FILTRES
  if (rechercheTextuelle) {
    articlesClasses = articlesClasses.filter((article) =>
      article.titreTraduit?.toLowerCase().includes(rechercheTextuelle),
    );
  }

  if (filtreSource) {
    articlesClasses = articlesClasses.filter(
      (article) => article.source.nom === filtreSource,
    );
  }

  // On garde les 50 meilleurs APRES avoir filtré
  const resultatsFinaux = articlesClasses.slice(0, 50);

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 md:py-20">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
            L'essentiel de l'IA.
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Un flux factuel, débarrassé du bruit médiatique et des fausses
            annonces.
          </p>

          {/* NOUVEAU : Barre de filtres par source */}
          <SourceFilters sourcesList={nomsDeSources} />
        </header>

        {resultatsFinaux.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun article ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <ArticleFeed initialArticles={resultatsFinaux} />
        )}
      </main>

      <Footer />
    </div>
  );
}
