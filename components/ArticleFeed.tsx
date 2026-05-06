'use client'; // Indispensable car on utilise des états (useState)

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

// On définit la forme des données qu'on va recevoir
type Article = {
  id: string;
  titreTraduit: string | null;
  resumePuces: any;
  urlOriginale: string;
  source: { nom: string };
  datePublicationOriginale: Date;
};

export function ArticleFeed({
  initialArticles,
}: {
  initialArticles: Article[];
}) {
  const [visibleCount, setVisibleCount] = useState(10); // On en affiche 10 au début

  const showMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleArticles = initialArticles.slice(0, visibleCount);
  const hasMore = visibleCount < initialArticles.length;

  // Petite fonction pour afficher "Il y a 2h" ou "14 Mai"
  function formaterDate(date: Date) {
    const maintenant = new Date();
    const dateArticle = new Date(date);
    const diffHeures = Math.floor(
      (maintenant.getTime() - dateArticle.getTime()) / (1000 * 60 * 60),
    );

    if (diffHeures < 1) return "Il y a moins d'une heure";
    if (diffHeures < 24) return `Il y a ${diffHeures}h`;

    return dateArticle.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  }

  return (
    <div className="space-y-12">
      {visibleArticles.map((article) => (
        <article key={article.id} className="group">
          {/* Titre style "Calibre" / "AraHub" */}
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">
            {article.titreTraduit || 'Titre indisponible'}
          </h2>

          {/* Description (Les 3 puces IA) */}
          <div className="text-gray-600 mb-6 space-y-2 text-base leading-relaxed">
            {Array.isArray(article.resumePuces) ? (
              article.resumePuces.map((puce, index) => (
                <p key={index}>• {puce as string}</p>
              ))
            ) : (
              <p>Résumé indisponible.</p>
            )}
          </div>

          {/* Ligne des Tags et du lien externe */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none font-medium"
              >
                {article.source.nom}
              </Badge>
              <span className="text-sm text-gray-400 font-medium">
                • {formaterDate(article.datePublicationOriginale)}
              </span>
              <Badge
                variant="outline"
                className="text-gray-500 border-gray-200 font-normal flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-blue-500" /> IA
              </Badge>
            </div>

            <a
              href={article.urlOriginale}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
            >
              Source originale <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Bouton principal noir (style "Voir le projet") */}
          <Button
            asChild
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg h-12 text-base"
          >
            <a
              href={article.urlOriginale}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lire l'article complet <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </article>
      ))}

      {/* Bouton "Voir plus" s'il reste des articles */}
      {hasMore && (
        <div className="pt-8 pb-4 text-center">
          <Button
            onClick={showMore}
            variant="outline"
            className="rounded-full px-8 border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Charger plus d'actualités
          </Button>
        </div>
      )}
    </div>
  );
}
