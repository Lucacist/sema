import { describe, it, expect } from 'vitest';

/**
 * Calcul du Gravity Score
 * Score = (scoreCuration * poidsSource) / (heuresDepuisPublication + 2)^1.5
 */
function calculateGravityScore(
  scoreCuration: number,
  poidsSource: number,
  datePublication: Date,
): number {
  const maintenant = new Date();
  const diffMs = maintenant.getTime() - datePublication.getTime();
  const heuresDepuisPublication = Math.max(0, diffMs / (1000 * 60 * 60));
  const denominateur = Math.pow(heuresDepuisPublication + 2, 1.5);
  return (scoreCuration * poidsSource) / denominateur;
}

describe('Gravity Score Algorithm', () => {
  it('devrait calculer le score pour un article récent avec score élevé', () => {
    const scoreCuration = 9;
    const poidsSource = 2.0;
    const datePublication = new Date(Date.now() - 1000 * 60 * 60); // Il y a 1h

    const score = calculateGravityScore(scoreCuration, poidsSource, datePublication);

    // Score attendu: (9 * 2.0) / (1 + 2)^1.5 = 18 / 5.196 ≈ 3.46
    expect(score).toBeGreaterThan(3.0);
    expect(score).toBeLessThan(4.0);
  });

  it('devrait dégrader le score avec le temps', () => {
    const scoreCuration = 8;
    const poidsSource = 1.5;

    const dateRecente = new Date(Date.now() - 1000 * 60 * 60 * 2); // Il y a 2h
    const dateAncienne = new Date(Date.now() - 1000 * 60 * 60 * 24); // Il y a 24h

    const scoreRecent = calculateGravityScore(scoreCuration, poidsSource, dateRecente);
    const scoreAncien = calculateGravityScore(scoreCuration, poidsSource, dateAncienne);

    expect(scoreRecent).toBeGreaterThan(scoreAncien);
  });

  it('devrait valoriser les sources premium', () => {
    const scoreCuration = 7;
    const datePublication = new Date(Date.now() - 1000 * 60 * 60 * 3); // Il y a 3h

    const scoreSourcePremium = calculateGravityScore(scoreCuration, 2.2, datePublication);
    const scoreSourceStandard = calculateGravityScore(scoreCuration, 1.0, datePublication);

    expect(scoreSourcePremium).toBeGreaterThan(scoreSourceStandard * 2);
  });

  it('devrait gérer les articles très récents (< 1h)', () => {
    const scoreCuration = 10;
    const poidsSource = 2.0;
    const datePublication = new Date(Date.now() - 1000 * 60 * 30); // Il y a 30min

    const score = calculateGravityScore(scoreCuration, poidsSource, datePublication);

    // Avec le +2 dans la formule, même un article très récent a une dégradation minimale
    expect(score).toBeGreaterThan(5.0);
  });

  it('devrait gérer les cas limites (score 1, poids 1)', () => {
    const scoreCuration = 1;
    const poidsSource = 1.0;
    const datePublication = new Date(Date.now() - 1000 * 60 * 60 * 12); // Il y a 12h

    const score = calculateGravityScore(scoreCuration, poidsSource, datePublication);

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });

  it('devrait retourner un score positif même pour des articles anciens', () => {
    const scoreCuration = 5;
    const poidsSource = 1.5;
    const datePublication = new Date(Date.now() - 1000 * 60 * 60 * 48); // Il y a 48h

    const score = calculateGravityScore(scoreCuration, poidsSource, datePublication);

    expect(score).toBeGreaterThan(0);
  });

  it('devrait trier correctement plusieurs articles', () => {
    const articles = [
      { score: 6, poids: 1.5, date: new Date(Date.now() - 1000 * 60 * 60 * 12) }, // 12h
      { score: 9, poids: 2.2, date: new Date(Date.now() - 1000 * 60 * 60 * 2) },  // 2h (devrait être 1er)
      { score: 8, poids: 1.0, date: new Date(Date.now() - 1000 * 60 * 60 * 1) },  // 1h
    ];

    const articlesAvecGravity = articles.map((a) => ({
      ...a,
      gravity: calculateGravityScore(a.score, a.poids, a.date),
    }));

    articlesAvecGravity.sort((a, b) => b.gravity - a.gravity);

    // L'article avec score 9 et poids 2.2 à 2h devrait être premier
    expect(articlesAvecGravity[0].score).toBe(9);
    expect(articlesAvecGravity[0].poids).toBe(2.2);
  });
});
