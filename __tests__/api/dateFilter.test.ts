import { describe, it, expect } from 'vitest';

/**
 * Fonction pour filtrer les articles de plus de 24h
 */
function isArticleRecent(datePublication: Date): boolean {
  const maintenant = new Date();
  const diffMs = maintenant.getTime() - datePublication.getTime();
  const heuresDepuisPublication = diffMs / (1000 * 60 * 60);
  return heuresDepuisPublication <= 24;
}

describe('Article Date Filter (24h)', () => {
  it('devrait accepter un article publié il y a 1 heure', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60); // Il y a 1h
    expect(isArticleRecent(date)).toBe(true);
  });

  it('devrait accepter un article publié il y a 12 heures', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 12); // Il y a 12h
    expect(isArticleRecent(date)).toBe(true);
  });

  it('devrait accepter un article publié il y a exactement 24 heures', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24); // Il y a 24h
    expect(isArticleRecent(date)).toBe(true);
  });

  it('devrait rejeter un article publié il y a 25 heures', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 25); // Il y a 25h
    expect(isArticleRecent(date)).toBe(false);
  });

  it('devrait rejeter un article publié il y a 48 heures', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 48); // Il y a 48h
    expect(isArticleRecent(date)).toBe(false);
  });

  it('devrait rejeter un article publié il y a 1 semaine', () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7); // Il y a 7 jours
    expect(isArticleRecent(date)).toBe(false);
  });

  it('devrait accepter un article publié il y a 30 minutes', () => {
    const date = new Date(Date.now() - 1000 * 60 * 30); // Il y a 30min
    expect(isArticleRecent(date)).toBe(true);
  });

  it('devrait gérer les dates futures (edge case)', () => {
    const date = new Date(Date.now() + 1000 * 60 * 60); // Dans 1h
    expect(isArticleRecent(date)).toBe(true);
  });

  it('devrait filtrer correctement un lot d\'articles mixtes', () => {
    const articles = [
      { id: 1, date: new Date(Date.now() - 1000 * 60 * 60 * 2) },   // 2h - OK
      { id: 2, date: new Date(Date.now() - 1000 * 60 * 60 * 23) },  // 23h - OK
      { id: 3, date: new Date(Date.now() - 1000 * 60 * 60 * 26) },  // 26h - KO
      { id: 4, date: new Date(Date.now() - 1000 * 60 * 60 * 48) },  // 48h - KO
      { id: 5, date: new Date(Date.now() - 1000 * 60 * 30) },       // 30min - OK
    ];

    const articlesRecents = articles.filter((a) => isArticleRecent(a.date));

    expect(articlesRecents).toHaveLength(3);
    expect(articlesRecents.map((a) => a.id)).toEqual([1, 2, 5]);
  });
});
