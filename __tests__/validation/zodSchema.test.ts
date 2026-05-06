import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Schéma Zod pour la validation des réponses OpenAI
 */
const ArticleAnalysisSchema = z.object({
  est_hors_sujet: z.boolean(),
  est_bloque_par_paywall: z.boolean(),
  est_de_la_hype_sans_substance: z.boolean(),
  score_curation: z.number().min(1).max(10),
  raison_rejet: z.string(),
  titre_fr_factuel: z.string(),
  resume_3_puces: z.array(z.string().max(150)).length(3),
});

type ArticleAnalysis = z.infer<typeof ArticleAnalysisSchema>;

describe('Zod Schema Validation', () => {
  it('devrait valider un objet correct', () => {
    const validData: ArticleAnalysis = {
      est_hors_sujet: false,
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: false,
      score_curation: 8,
      raison_rejet: '',
      titre_fr_factuel: 'OpenAI lance GPT-5',
      resume_3_puces: [
        'OpenAI annonce GPT-5 avec des capacités multimodales avancées',
        'Le modèle sera disponible en version beta pour les développeurs',
        'Les performances dépassent GPT-4 de 40% sur les benchmarks',
      ],
    };

    const result = ArticleAnalysisSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.score_curation).toBe(8);
      expect(result.data.resume_3_puces).toHaveLength(3);
    }
  });

  it('devrait rejeter un score hors limites (< 1)', () => {
    const invalidData = {
      est_hors_sujet: false,
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: false,
      score_curation: 0,
      raison_rejet: '',
      titre_fr_factuel: 'Test',
      resume_3_puces: ['Point 1', 'Point 2', 'Point 3'],
    };

    const result = ArticleAnalysisSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('devrait rejeter un score hors limites (> 10)', () => {
    const invalidData = {
      est_hors_sujet: false,
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: false,
      score_curation: 11,
      raison_rejet: '',
      titre_fr_factuel: 'Test',
      resume_3_puces: ['Point 1', 'Point 2', 'Point 3'],
    };

    const result = ArticleAnalysisSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('devrait rejeter un résumé avec moins de 3 puces', () => {
    const invalidData = {
      est_hors_sujet: false,
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: false,
      score_curation: 7,
      raison_rejet: '',
      titre_fr_factuel: 'Test',
      resume_3_puces: ['Point 1', 'Point 2'],
    };

    const result = ArticleAnalysisSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('devrait rejeter un résumé avec plus de 3 puces', () => {
    const invalidData = {
      est_hors_sujet: false,
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: false,
      score_curation: 7,
      raison_rejet: '',
      titre_fr_factuel: 'Test',
      resume_3_puces: ['Point 1', 'Point 2', 'Point 3', 'Point 4'],
    };

    const result = ArticleAnalysisSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('devrait rejeter une puce trop longue (> 150 caractères)', () => {
    const longText = 'A'.repeat(151);
    const invalidData = {
      est_hors_sujet: false,
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: false,
      score_curation: 7,
      raison_rejet: '',
      titre_fr_factuel: 'Test',
      resume_3_puces: [longText, 'Point 2', 'Point 3'],
    };

    const result = ArticleAnalysisSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('devrait accepter une puce de 150 caractères exactement', () => {
    const exactText = 'A'.repeat(150);
    const validData = {
      est_hors_sujet: false,
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: false,
      score_curation: 7,
      raison_rejet: '',
      titre_fr_factuel: 'Test',
      resume_3_puces: [exactText, 'Point 2', 'Point 3'],
    };

    const result = ArticleAnalysisSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('devrait rejeter des champs manquants', () => {
    const invalidData = {
      est_hors_sujet: false,
      score_curation: 7,
      titre_fr_factuel: 'Test',
    };

    const result = ArticleAnalysisSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('devrait rejeter des types incorrects', () => {
    const invalidData = {
      est_hors_sujet: 'false', // string au lieu de boolean
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: false,
      score_curation: 7,
      raison_rejet: '',
      titre_fr_factuel: 'Test',
      resume_3_puces: ['Point 1', 'Point 2', 'Point 3'],
    };

    const result = ArticleAnalysisSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('devrait valider un article rejeté pour hype', () => {
    const validData: ArticleAnalysis = {
      est_hors_sujet: false,
      est_bloque_par_paywall: false,
      est_de_la_hype_sans_substance: true,
      score_curation: 3,
      raison_rejet: 'Article contient des superlatifs sans données mesurables',
      titre_fr_factuel: 'Une nouvelle IA révolutionnaire',
      resume_3_puces: ['Point 1', 'Point 2', 'Point 3'],
    };

    const result = ArticleAnalysisSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.est_de_la_hype_sans_substance).toBe(true);
      expect(result.data.raison_rejet).toBeTruthy();
    }
  });
});
