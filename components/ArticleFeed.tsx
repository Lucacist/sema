'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Sparkles,
  Brain,
  Code2,
  TrendingUp,
  Users,
  Newspaper,
} from 'lucide-react';

// Fonction pour afficher une date relative ("Il y a 2h" ou "14 Mai")
function formaterDate(date: Date | string | null) {
  if (!date) return 'Date inconnue';
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

// 🎨 NOUVEAU : Fonction qui attribue le style en fonction de la catégorie
function getCategoryStyle(categorie?: string) {
  switch (categorie) {
    case 'Recherche & Modèles':
      return {
        icon: Brain,
        badgeColor:
          'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
        cardBorder: 'border-l-purple-500',
      };
    case 'Open Source':
      return {
        icon: Code2,
        badgeColor:
          'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
        cardBorder: 'border-l-orange-500',
      };
    case 'Business & Startups':
      return {
        icon: TrendingUp,
        badgeColor:
          'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
        cardBorder: 'border-l-emerald-500',
      };
    case 'Veille Communautaire':
      return {
        icon: Users,
        badgeColor:
          'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
        cardBorder: 'border-l-blue-500',
      };
    default:
      return {
        icon: Newspaper,
        badgeColor:
          'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200',
        cardBorder: 'border-l-gray-300',
      };
  }
}

export function ArticleFeed({ initialArticles }: { initialArticles: any[] }) {
  const [articlesVisibles, setArticlesVisibles] = useState(10);

  const chargerPlus = () => {
    setArticlesVisibles((prev) => prev + 10);
  };

  const articlesAffiches = initialArticles.slice(0, articlesVisibles);

  return (
    <div className="flex flex-col gap-8">
      {articlesAffiches.map((article) => {
        // On récupère le style pour cet article
        const {
          icon: CategoryIcon,
          badgeColor,
          cardBorder,
        } = getCategoryStyle(article.source?.categorieDefaut);

        return (
          <div className="flex flex-col gap-8">
            <article
              key={article.id}
              className={'flex flex-col overflow-hidden '}
            >
              {/* En-tête : Badges et Date */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Badge coloré de la source avec Icône */}
                  <Badge
                    variant="outline"
                    className={`${badgeColor} font-semibold flex items-center gap-1.5 px-3 py-1 shadow-sm`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {article.source?.nom || 'Source inconnue'}
                  </Badge>

                  <span className="text-sm text-gray-400 font-medium ml-1">
                    • {formaterDate(article.datePublicationOriginale)}
                  </span>

                  <Badge
                    variant="outline"
                    className="text-gray-500 border-gray-200 font-normal flex items-center gap-1 ml-2 bg-gray-50"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" /> IA Score:{' '}
                    {article.scoreCuration || '?'}/10
                  </Badge>
                </div>

                <a
                  href={article.urlOriginale}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors font-medium"
                >
                  Lire l'original <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Corps de l'article */}
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4 leading-tight">
                {article.titreTraduit || 'Titre en cours de traitement...'}
              </h2>

              <div className="text-gray-600 space-y-3 text-base sm:text-lg leading-relaxed">
                {article.resumePuces && Array.isArray(article.resumePuces) ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {article.resumePuces.map((puce: string, index: number) => (
                      <li key={index} className="pl-1 marker:text-gray-300">
                        {puce}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{article.resumePuces || 'Résumé non disponible.'}</p>
                )}
              </div>
            </article>
            <div className="h-0.5 w-full bg-gray-400 rounded-full"></div>
          </div>
        );
      })}

      {initialArticles.length > articlesVisibles && (
        <div className="text-center pt-8 pb-4">
          <Button
            variant="outline"
            size="lg"
            onClick={chargerPlus}
            className="rounded-full px-8 border-gray-200 text-zinc-700 hover:bg-gray-50 hover:text-zinc-900"
          >
            Voir plus d'actualités
          </Button>
        </div>
      )}
    </div>
  );
}
