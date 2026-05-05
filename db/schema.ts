import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  jsonb,
  pgEnum,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// L'Enum pour les statuts
export const statutEnum = pgEnum("statut_article", [
  "EN_ATTENTE",
  "EN_OBSERVATION",
  "REJETE_IA",
  "PUBLIE",
  "ERREUR_API",
  "IGNORE_SCORE_FAIBLE",
]);

// Table 1 : Les Sources
export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  nom: text("nom").notNull(),
  urlFlux: text("url_flux").notNull(),
  categorieDefaut: text("categorie_defaut"),
  poidsSource: real("poids_source").default(1.0).notNull(),
  actif: boolean("actif").default(true).notNull(),
});

// Table 2 : Les Articles
export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id")
    .references(() => sources.id)
    .notNull(),
  urlOriginale: text("url_originale").notNull(),
  hashContenu: text("hash_contenu").unique().notNull(),
  statut: statutEnum("statut").default("EN_ATTENTE").notNull(),
  pointsHn: integer("points_hn"),
  titreTraduit: text("titre_traduit"),
  resumePuces: jsonb("resume_puces"), // Stockera notre tableau de 3 puces
  scoreCuration: integer("score_curation"),
  raisonRejet: text("raison_rejet"),
  datePublicationOriginale: timestamp("date_publication_originale").notNull(),
  dateAjout: timestamp("date_ajout").defaultNow().notNull(),
  dateTraitementIa: timestamp("date_traitement_ia"),
});

// Définition des relations (très pratique pour récupérer les articles avec leur source)
export const sourcesRelations = relations(sources, ({ many }) => ({
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  source: one(sources, {
    fields: [articles.sourceId],
    references: [sources.id],
  }),
}));
