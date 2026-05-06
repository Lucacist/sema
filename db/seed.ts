import { db } from './index';
import { sources } from './schema';

async function main() {
  console.log('🌱 Lancement du Seed (Sources Premium)...');

  const sourcesPremium = [
    {
      nom: 'OpenAI News',
      urlFlux: 'https://openai.com/news/rss.xml',
      categorieDefaut: 'Recherche & Modèles',
      poidsSource: 2.2,
      actif: true,
    },
    {
      nom: 'Anthropic News',
      urlFlux: 'https://www.anthropic.com/news/rss.xml',
      categorieDefaut: 'Recherche & Modèles',
      poidsSource: 2.2,
      actif: true,
    },
    {
      nom: 'Google DeepMind',
      urlFlux: 'https://deepmind.google/blog/rss.xml',
      categorieDefaut: 'Recherche & Modèles',
      poidsSource: 2.0,
      actif: true,
    },
    {
      nom: 'Hugging Face',
      urlFlux: 'https://huggingface.co/blog/feed.xml',
      categorieDefaut: 'Open Source',
      poidsSource: 1.8,
      actif: true,
    },
    {
      nom: 'Google AI Blog',
      urlFlux: 'https://blog.google/technology/ai/rss/',
      categorieDefaut: 'Recherche & Modèles',
      poidsSource: 2.0,
      actif: true,
    },
    {
      nom: 'MIT Tech Review AI',
      urlFlux:
        'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
      categorieDefaut: 'Business & Startups',
      poidsSource: 1.3,
      actif: true,
    },
    {
      nom: 'The Verge AI',
      urlFlux:
        'https://www.theverge.com/rss/artificial-intelligence-ai/index.xml',
      categorieDefaut: 'Business & Startups',
      poidsSource: 1.2,
      actif: true,
    },
    {
      nom: 'Hacker News AI',
      urlFlux:
        'https://hn.algolia.com/api/v1/search_by_date?query=OpenAI,Anthropic,DeepMind,LLM,Claude,Llama&tags=story&numericFilters=points>=40',
      categorieDefaut: 'Veille Communautaire',
      poidsSource: 1.5,
      actif: true,
    },
  ];

  try {
    for (const source of sourcesPremium) {
      await db.insert(sources).values(source);
      console.log(`✅ Source ajoutée : ${source.nom}`);
    }

    console.log('🎉 Seed terminé avec succès ! Tes sources sont prêtes.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
    process.exit(1);
  }
}

main();
