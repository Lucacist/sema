import { describe, it, expect } from 'vitest';

/**
 * Machine à états pour les articles Hacker News
 */
type ArticleStatus = 'en_attente' | 'en_observation' | 'ignore_score_faible';

interface HNArticle {
  id: string;
  points: number;
  datePublication: Date;
  statut: ArticleStatus;
}

function determineInitialStatus(points: number): ArticleStatus {
  if (points >= 50) return 'en_attente';
  if (points >= 20) return 'en_observation';
  return 'ignore_score_faible';
}

function shouldPromoteToAttente(article: HNArticle, newPoints: number): boolean {
  return article.statut === 'en_observation' && newPoints >= 50;
}

function shouldExpireObservation(article: HNArticle): boolean {
  if (article.statut !== 'en_observation') return false;
  const maintenant = new Date();
  const diffMs = maintenant.getTime() - article.datePublication.getTime();
  const heuresDepuisPublication = diffMs / (1000 * 60 * 60);
  return heuresDepuisPublication > 24;
}

describe('Hacker News State Machine', () => {
  describe('Initial Status Determination', () => {
    it('devrait mettre en_attente pour 50+ points', () => {
      expect(determineInitialStatus(50)).toBe('en_attente');
      expect(determineInitialStatus(100)).toBe('en_attente');
      expect(determineInitialStatus(500)).toBe('en_attente');
    });

    it('devrait mettre en_observation pour 20-49 points', () => {
      expect(determineInitialStatus(20)).toBe('en_observation');
      expect(determineInitialStatus(35)).toBe('en_observation');
      expect(determineInitialStatus(49)).toBe('en_observation');
    });

    it('devrait ignorer pour < 20 points', () => {
      expect(determineInitialStatus(0)).toBe('ignore_score_faible');
      expect(determineInitialStatus(10)).toBe('ignore_score_faible');
      expect(determineInitialStatus(19)).toBe('ignore_score_faible');
    });
  });

  describe('Promotion from Observation to Attente', () => {
    it('devrait promouvoir un article en_observation qui atteint 50 points', () => {
      const article: HNArticle = {
        id: '1',
        points: 30,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 2),
        statut: 'en_observation',
      };

      expect(shouldPromoteToAttente(article, 50)).toBe(true);
      expect(shouldPromoteToAttente(article, 75)).toBe(true);
    });

    it('ne devrait pas promouvoir si les points restent < 50', () => {
      const article: HNArticle = {
        id: '1',
        points: 30,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 2),
        statut: 'en_observation',
      };

      expect(shouldPromoteToAttente(article, 40)).toBe(false);
      expect(shouldPromoteToAttente(article, 49)).toBe(false);
    });

    it('ne devrait pas promouvoir un article déjà en_attente', () => {
      const article: HNArticle = {
        id: '1',
        points: 60,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 2),
        statut: 'en_attente',
      };

      expect(shouldPromoteToAttente(article, 100)).toBe(false);
    });
  });

  describe('TTL 24h for Observation', () => {
    it('devrait expirer un article en_observation après 24h', () => {
      const article: HNArticle = {
        id: '1',
        points: 30,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25h
        statut: 'en_observation',
      };

      expect(shouldExpireObservation(article)).toBe(true);
    });

    it('ne devrait pas expirer un article en_observation avant 24h', () => {
      const article: HNArticle = {
        id: '1',
        points: 30,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20h
        statut: 'en_observation',
      };

      expect(shouldExpireObservation(article)).toBe(false);
    });

    it('ne devrait pas expirer un article en_attente', () => {
      const article: HNArticle = {
        id: '1',
        points: 60,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30h
        statut: 'en_attente',
      };

      expect(shouldExpireObservation(article)).toBe(false);
    });

    it('devrait gérer le cas limite de 24h exactement', () => {
      const article: HNArticle = {
        id: '1',
        points: 30,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24h
        statut: 'en_observation',
      };

      expect(shouldExpireObservation(article)).toBe(false);
    });
  });

  describe('Full State Machine Workflow', () => {
    it('devrait gérer le workflow complet: observation -> promotion -> attente', () => {
      // 1. Article arrive avec 25 points
      let statut = determineInitialStatus(25);
      expect(statut).toBe('en_observation');

      // 2. Après 2h, l'article monte à 55 points
      const article: HNArticle = {
        id: '1',
        points: 25,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 2),
        statut: 'en_observation',
      };

      expect(shouldPromoteToAttente(article, 55)).toBe(true);
    });

    it('devrait gérer le workflow: observation -> expiration', () => {
      // 1. Article arrive avec 30 points
      let statut = determineInitialStatus(30);
      expect(statut).toBe('en_observation');

      // 2. Après 25h, toujours 30 points -> expire
      const article: HNArticle = {
        id: '1',
        points: 30,
        datePublication: new Date(Date.now() - 1000 * 60 * 60 * 25),
        statut: 'en_observation',
      };

      expect(shouldExpireObservation(article)).toBe(true);
    });

    it('devrait gérer le workflow direct: 100 points -> en_attente immédiatement', () => {
      const statut = determineInitialStatus(100);
      expect(statut).toBe('en_attente');
    });
  });
});
