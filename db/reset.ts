import { db } from './index';
import { articles, sources } from './schema';

async function main() {
  console.log('🧨 Lancement de la destruction des données...');

  try {
    // On supprime d'abord les articles (car ils dépendent des sources)
    console.log('1. Suppression des articles...');
    await db.delete(articles);

    // Ensuite on supprime les sources
    console.log('2. Suppression des sources...');
    await db.delete(sources);

    console.log('✅ Base de données entièrement vidée ! Prête pour le Seed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du reset :', error);
    process.exit(1);
  }
}

main();
