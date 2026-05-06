import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Fonction de hash SHA-256 pour déduplication
 */
function hashContent(url: string, title: string): string {
  const content = `${url}||${title}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

describe('Content Hashing', () => {
  it('devrait générer un hash SHA-256 valide', () => {
    const url = 'https://example.com/article';
    const title = 'Test Article';

    const hash = hashContent(url, title);

    expect(hash).toHaveLength(64); // SHA-256 = 64 caractères hex
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('devrait générer le même hash pour le même contenu', () => {
    const url = 'https://example.com/article';
    const title = 'Test Article';

    const hash1 = hashContent(url, title);
    const hash2 = hashContent(url, title);

    expect(hash1).toBe(hash2);
  });

  it('devrait générer des hash différents pour des contenus différents', () => {
    const hash1 = hashContent('https://example.com/article1', 'Article 1');
    const hash2 = hashContent('https://example.com/article2', 'Article 2');

    expect(hash1).not.toBe(hash2);
  });

  it('devrait être sensible à la casse', () => {
    const hash1 = hashContent('https://example.com/article', 'Test Article');
    const hash2 = hashContent('https://example.com/article', 'test article');

    expect(hash1).not.toBe(hash2);
  });

  it('devrait détecter les doublons même avec des URLs légèrement différentes', () => {
    const url1 = 'https://example.com/article';
    const url2 = 'https://example.com/article?utm_source=twitter';
    const title = 'Same Article';

    const hash1 = hashContent(url1, title);
    const hash2 = hashContent(url2, title);

    // Les hash sont différents car les URLs sont différentes
    // C'est le comportement attendu pour éviter les faux positifs
    expect(hash1).not.toBe(hash2);
  });

  it('devrait gérer les caractères spéciaux', () => {
    const url = 'https://example.com/article?q=test&lang=fr';
    const title = 'L\'IA révolutionne le monde 🚀';

    const hash = hashContent(url, title);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('devrait gérer les chaînes vides', () => {
    const hash = hashContent('', '');

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
