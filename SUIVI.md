# 📊 Suivi du Projet Sema

**Dernière mise à jour :** 6 mai 2026

---

## 🎯 Vue d'ensemble

| Catégorie           | Progression | Statut          |
| ------------------- | ----------- | --------------- |
| **Infrastructure**  | 100%        | � Terminé       |
| **Base de données** | 100%        | � Terminé       |
| **Backend (API)**   | 100%        | � Terminé       |
| **Frontend**        | 90%         | � Quasi terminé |
| **IA & Traitement** | 100%        | � Terminé       |
| **Cron Jobs**       | 100%        | � Terminé       |
| **Tests**           | 0%          | 🔴 À faire      |
| **Déploiement**     | 100%        | 🟢 Terminé      |

**Progression globale : ~90%** 🎉

---

## ✅ Fait

### Infrastructure & Configuration ✅

- [x] Projet Next.js 16.2.4 initialisé avec App Router
- [x] README.md complet et professionnel
- [x] TypeScript configuré en mode strict
- [x] Tailwind CSS 4 configuré
- [x] ESLint configuré
- [x] Variables d'environnement configurées (`.env` présent)

### Base de données ✅

- [x] **Drizzle ORM choisi et configuré**
- [x] **NeonDB configuré** (connexion via `@neondatabase/serverless`)
- [x] **Schéma complet créé** (`db/schema.ts`)
  - Table `sources` avec tous les champs (id, nom, urlFlux, categorieDefaut, poidsSource, actif)
  - Table `articles` avec tous les champs (id, sourceId, urlOriginale, hashContenu, statut, pointsHn, titreTraduit, resumePuces, scoreCuration, raisonRejet, dates)
  - Enum `statutEnum` avec les 6 statuts
  - Relations définies entre les tables
- [x] **Configuration Drizzle** (`drizzle.config.ts`)
- [x] **Instance DB exportée** (`db/index.ts`)
- [x] Script `db:push` dans package.json

### Backend - API Routes ✅

- [x] **Cron d'Ingestion** (`/api/cron/ingest/route.ts`) - COMPLET
  - Parser RSS fonctionnel avec `rss-parser`
  - Intégration Hacker News via API Algolia
  - Machine à états (EN_ATTENTE, EN_OBSERVATION)
  - Système de mise à jour des points HN
  - TTL 24h pour articles en observation
  - Hash SHA-256 pour déduplication
  - Gestion d'erreurs isolée par source
  - Sécurisation avec CRON_SECRET
  - Logging détaillé
- [x] **Cron de Traitement IA** (`/api/cron/process/route.ts`) - COMPLET
  - Intégration OpenAI avec `gpt-4o-mini`
  - Structured Outputs avec Zod
  - Aspiration de contenu via Jina Reader
  - Mega-Prompt complet avec tous les filtres
  - Batching de 3 articles par exécution
  - Gestion des erreurs et retry logic
  - Sécurisation avec CRON_SECRET
  - Logging détaillé

### Intelligence Artificielle ✅

- [x] **OpenAI SDK intégré** (version 6.36.0)
- [x] **Zod configuré** (version 4.4.3)
- [x] **Schéma de validation complet**
  - `est_hors_sujet`
  - `est_bloque_par_paywall`
  - `est_de_la_hype_sans_substance`
  - `score_curation` (1-10)
  - `raison_rejet`
  - `titre_fr_factuel`
  - `resume_3_puces` (tableau de 3 strings)
- [x] **Mega-Prompt implémenté**
  - Filtre paywall
  - Filtre hype
  - Filtre hors-sujet IA
  - Synthèse transformatrice
- [x] **Jina Reader intégré** pour l'aspiration de contenu

### Frontend ✅

- [x] **Page d'accueil** (`app/page.tsx`) - COMPLÈTE
  - Récupération des articles depuis la DB
  - **Calcul du Gravity Score implémenté** avec la formule exacte
  - Tri avec dégradation temporelle
  - Gestion des cas limites (poids source, dates)
  - Tri secondaire par date
  - Server Component (force-dynamic)
- [x] **ArticleFeed** (`components/ArticleFeed.tsx`) - COMPLET
  - Affichage des articles avec données réelles de la DB
  - Pagination "Voir plus" (10 articles par page)
  - Format 3 puces respecté
  - Formatage de date relatif ("Il y a 2h")
  - Client Component avec useState
- [x] **Navbar** (`components/Navbar.tsx`)
  - Logo Sema
  - Barre de recherche (UI prête, fonctionnalité à implémenter)
  - Design moderne avec backdrop-blur
- [x] **Footer** (`components/Footer.tsx`)
  - Copyright
  - Liens vers politique de confidentialité
  - Lien "Signaler un article"
- [x] **Composants UI shadcn/ui**
  - Badge
  - Button
  - Input
- [x] **Design System**
  - Tailwind CSS 4 configuré
  - Google Sans Flex comme police
  - Palette de couleurs définie
  - Composants stylés façon portfolio moderne
- [x] **Layout** (`app/layout.tsx`)
  - Metadata configurée
  - Police Google Sans Flex
  - HTML lang="fr"

### Dépendances installées ✅

- [x] Next.js 16.2.4
- [x] React 19.2.4
- [x] Drizzle ORM 0.45.2
- [x] @neondatabase/serverless 1.1.0
- [x] OpenAI 6.36.0
- [x] Zod 4.4.3
- [x] rss-parser 3.13.0
- [x] Lucide React (icônes)
- [x] shadcn/ui components
- [x] class-variance-authority, clsx, tailwind-merge

### Déploiement ✅

- [x] **Application déployée sur Vercel** (https://sema-mocha.vercel.app)
- [x] **GitHub Actions configurées** pour les Cron Jobs
  - `.github/workflows/cron-ingest.yml` - Ingestion toutes les 2h
  - `.github/workflows/cron-process.yml` - Traitement IA toutes les 15min
- [x] **Secrets GitHub configurés**
  - `CRON_SECRET` pour sécuriser les appels
- [x] **Variables d'environnement Vercel**
  - `DATABASE_URL`
  - `OPENAI_API_KEY`
  - `CRON_SECRET`
- [x] **Workflow dispatch activé** pour tests manuels

---

## 🚧 En cours

### Frontend

- [ ] **Fonctionnalité de recherche**
  - Implémenter la logique de recherche (UI déjà présente)
- [ ] **Pages légales**
  - Créer les pages manquantes (mentions légales, confidentialité, contact)

---

## 🔴 À faire (Par priorité)

### 1. Finalisation Frontend (PRIORITÉ HAUTE)

- [ ] **Fonctionnalité de recherche**
  - Implémenter la recherche dans les titres
  - Filtrage côté client ou API route dédiée
- [ ] **Filtres**
  - Filtre par source (dropdown)
  - Filtre par score de curation
- [ ] **Page Légale** (CRITIQUE pour le déploiement)
  - Mentions légales
  - Politique de confidentialité
  - Formulaire de contact pour Notice & Takedown
  - Email de contact visible
- [ ] **Gestion d'erreurs**
  - Error Boundaries
  - États de loading
  - Messages d'erreur utilisateur

### 2. Configuration & Maintenance (PRIORITÉ MOYENNE)

- [ ] **Créer `.env.example`**
  ```env
  DATABASE_URL="postgresql://..."
  OPENAI_API_KEY="sk-..."
  CRON_SECRET="votre-secret-securise"
  NODE_ENV="production"
  ```
- [ ] **Script de seed**
  - Créer `db/seed.ts` avec sources initiales
  - Hacker News (Algolia API)
  - MIT Technology Review RSS
  - OpenAI Blog RSS
  - Etc.
- [ ] **Monitoring**
  - Vérifier les logs GitHub Actions régulièrement
  - Surveiller les coûts OpenAI

### 3. API Routes supplémentaires (PRIORITÉ MOYENNE)

- [ ] **API Articles** (optionnel, actuellement fait côté serveur)
  - `GET /api/articles` - Liste paginée avec Gravity Score
  - `GET /api/articles/[id]` - Détail d'un article
- [ ] **API Sources** (pour backoffice futur)
  - `GET /api/sources` - Liste des sources actives
  - `POST /api/sources` - Ajouter une source (admin)
- [ ] **API Stats** (optionnel)
  - Statistiques sur les articles traités
  - Taux de rejet, sources les plus actives

### 4. Tests (PRIORITÉ BASSE)

- [ ] **Tests unitaires**
  - Calcul du Gravity Score
  - Validation Zod
  - Hashing de contenu

---

## 🎯 Roadmap

### Phase 1 : MVP ✅ (QUASI TERMINÉ - 90%)

- ✅ Base de données opérationnelle (Drizzle + NeonDB)
- ✅ Moteur d'ingestion fonctionnel (HN + RSS)
- ✅ Moteur IA avec mega-prompt complet
- ✅ Frontend moderne et fonctionnel
- ✅ Déploiement sur Vercel avec GitHub Actions

**Reste à faire pour finaliser le MVP :**

- Créer `.env.example`
- Créer les pages légales (mentions, confidentialité, contact)
- Implémenter la recherche
- Script de seed pour sources initiales

### Phase 2 : Amélioration (1-2 semaines) - À VENIR

- Ajout de sources supplémentaires
- Backoffice admin
- Optimisations de performance
- Tests automatisés

---

## 🔄 Historique des modifications

| Date             | Modification                                                          | Auteur  |
| ---------------- | --------------------------------------------------------------------- | ------- |
| 2026-05-06 15:30 | Mise à jour complète après analyse du code - Progression réelle : 85% | Cascade |
| 2026-05-06 15:24 | Création du document de suivi                                         | Cascade |

---

**Note :** Ce document doit être mis à jour régulièrement pour refléter l'avancement réel du projet.
