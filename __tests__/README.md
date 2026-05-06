# Tests Sema

Suite de tests complète pour le projet Sema utilisant **Vitest** et **React Testing Library**.

## 🚀 Lancer les tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm test -- --watch

# Lancer les tests avec l'interface UI
npm run test:ui

# Générer un rapport de couverture
npm run test:coverage
```

## 📁 Structure des tests

```
__tests__/
├── utils/
│   ├── gravityScore.test.ts      # Tests du Gravity Score
│   └── hash.test.ts               # Tests du hashing SHA-256
├── validation/
│   └── zodSchema.test.ts          # Tests de validation Zod
├── components/
│   ├── ArticleFeed.test.tsx       # Tests du composant ArticleFeed
│   └── SourceFilters.test.tsx     # Tests du composant SourceFilters
├── api/
│   └── dateFilter.test.ts         # Tests du filtre 24h
└── integration/
    └── hnStateMachine.test.ts     # Tests de la machine à états HN
```

## 🧪 Couverture des tests

### Tests Unitaires

#### 1. **Gravity Score** (`utils/gravityScore.test.ts`)
- ✅ Calcul du score pour articles récents
- ✅ Dégradation temporelle
- ✅ Valorisation des sources premium
- ✅ Gestion des cas limites
- ✅ Tri correct des articles

#### 2. **Hash SHA-256** (`utils/hash.test.ts`)
- ✅ Génération de hash valide
- ✅ Déduplication (même contenu = même hash)
- ✅ Sensibilité à la casse
- ✅ Gestion des caractères spéciaux

#### 3. **Validation Zod** (`validation/zodSchema.test.ts`)
- ✅ Validation d'objets corrects
- ✅ Rejet des scores hors limites (< 1 ou > 10)
- ✅ Validation du format 3 puces
- ✅ Limite de 150 caractères par puce
- ✅ Gestion des champs manquants
- ✅ Validation des types

### Tests de Composants

#### 4. **ArticleFeed** (`components/ArticleFeed.test.tsx`)
- ✅ Affichage des articles
- ✅ Affichage des 3 puces
- ✅ Affichage du score IA
- ✅ Pagination (10 articles par page)
- ✅ Bouton "Voir plus"
- ✅ Liens vers articles originaux

#### 5. **SourceFilters** (`components/SourceFilters.test.tsx`)
- ✅ Affichage des badges de sources
- ✅ Mise à jour de l'URL au clic
- ✅ Bouton "Toutes les actus"
- ✅ Style de la source active
- ✅ Préservation des autres paramètres URL

### Tests d'Intégration

#### 6. **Filtre 24h** (`api/dateFilter.test.ts`)
- ✅ Acceptation des articles récents (< 24h)
- ✅ Rejet des articles anciens (> 24h)
- ✅ Gestion du cas limite (exactement 24h)
- ✅ Filtrage de lots mixtes

#### 7. **Machine à États HN** (`integration/hnStateMachine.test.ts`)
- ✅ Détermination du statut initial (50+, 20-49, < 20 points)
- ✅ Promotion de `en_observation` à `en_attente`
- ✅ TTL 24h pour articles en observation
- ✅ Workflows complets

## 📊 Statistiques

- **Total de tests** : 60+
- **Couverture** : Fonctions critiques à 100%
- **Framework** : Vitest + React Testing Library
- **Environnement** : jsdom

## 🔧 Configuration

Les tests utilisent :
- `vitest.config.ts` - Configuration Vitest
- `vitest.setup.ts` - Setup global (jest-dom)
- Mocks pour Next.js navigation (`useRouter`, `useSearchParams`)

## 📝 Bonnes Pratiques

1. **Tests isolés** : Chaque test est indépendant
2. **Mocks minimaux** : On mock uniquement ce qui est nécessaire
3. **Assertions claires** : Messages d'erreur explicites
4. **Cas limites** : Tests des edge cases systématiques
5. **Nommage descriptif** : `devrait faire X quand Y`

## 🚨 Tests à Ajouter (Futur)

- [ ] Tests E2E avec Playwright
- [ ] Tests de performance (Lighthouse)
- [ ] Tests d'accessibilité (a11y)
- [ ] Tests des API routes (avec mocks DB)
- [ ] Tests de sécurité (CRON_SECRET, injection)

## 🐛 Debugging

```bash
# Lancer un seul fichier de test
npm test gravityScore

# Mode debug
npm test -- --inspect-brk

# Verbose output
npm test -- --reporter=verbose
```

## 📚 Documentation

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM](https://github.com/testing-library/jest-dom)
