import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArticleFeed } from '@/components/ArticleFeed';

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

export default async function Home() {
  // On récupère un bon paquet d'articles (ex: 50) pour avoir du stock pour le bouton "Voir plus"
  const articlesPublies = await db.query.articles.findMany({
    where: eq(articles.statut, 'PUBLIE'),
    with: { source: true },
  });

  // On trie côté serveur
  const articlesClasses = articlesPublies
    .map((article) => {
      const scoreCur = article.scoreCuration || 5;
      const gravityScore = calculerGravityScore(
        article.source.poidsSource,
        scoreCur,
        article.datePublicationOriginale,
      );
      return { ...article, gravityScore };
    })
    .sort((a, b) => b.gravityScore - a.gravityScore)
    .slice(0, 50); // On garde que les 50 meilleurs pour ne pas surcharger le navigateur

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-blue-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 md:py-20">
        <header className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
            L'essentiel de l'IA.
          </h1>
          <p className="text-lg text-gray-500">
            Un flux factuel, débarrassé du bruit médiatique et des fausses
            annonces. Sélectionné et synthétisé par intelligence artificielle.
          </p>
        </header>

        {articlesClasses.length === 0 ? (
          <p className="text-gray-500">Aucun article publié pour le moment.</p>
        ) : (
          <ArticleFeed initialArticles={articlesClasses} />
        )}
      </main>

      <Footer />
    </div>
  );
}
