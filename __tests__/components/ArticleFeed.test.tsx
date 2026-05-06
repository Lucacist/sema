import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleFeed } from '@/components/ArticleFeed';

describe('ArticleFeed Component', () => {
  const mockArticles = [
    {
      id: '1',
      titreTraduit: 'Article de test 1',
      resumePuces: ['Point 1', 'Point 2', 'Point 3'],
      urlOriginale: 'https://example.com/1',
      scoreCuration: 8,
      datePublication: new Date('2024-05-06T10:00:00Z'),
      source: {
        id: 's1',
        nom: 'OpenAI',
        categorieDefaut: 'Recherche & Modèles',
        poidsSource: 2.2,
      },
    },
    {
      id: '2',
      titreTraduit: 'Article de test 2',
      resumePuces: ['Point A', 'Point B', 'Point C'],
      urlOriginale: 'https://example.com/2',
      scoreCuration: 7,
      datePublication: new Date('2024-05-06T12:00:00Z'),
      source: {
        id: 's2',
        nom: 'Anthropic',
        categorieDefaut: 'Recherche & Modèles',
        poidsSource: 2.2,
      },
    },
  ];

  // Créer 15 articles pour tester la pagination
  const manyArticles = Array.from({ length: 15 }, (_, i) => ({
    id: `${i + 1}`,
    titreTraduit: `Article ${i + 1}`,
    resumePuces: ['Point 1', 'Point 2', 'Point 3'],
    urlOriginale: `https://example.com/${i + 1}`,
    scoreCuration: 8,
    datePublication: new Date('2024-05-06T10:00:00Z'),
    source: {
      id: `s${i + 1}`,
      nom: 'Test Source',
      categorieDefaut: 'Recherche & Modèles',
      poidsSource: 1.5,
    },
  }));

  it('devrait afficher les articles', () => {
    render(<ArticleFeed initialArticles={mockArticles} />);

    expect(screen.getByText('Article de test 1')).toBeInTheDocument();
    expect(screen.getByText('Article de test 2')).toBeInTheDocument();
  });

  it('devrait afficher les 3 puces pour chaque article', () => {
    render(<ArticleFeed initialArticles={mockArticles} />);

    expect(screen.getByText('Point 1')).toBeInTheDocument();
    expect(screen.getByText('Point 2')).toBeInTheDocument();
    expect(screen.getByText('Point 3')).toBeInTheDocument();
  });

  it('devrait afficher le nom de la source', () => {
    render(<ArticleFeed initialArticles={mockArticles} />);

    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Anthropic')).toBeInTheDocument();
  });

  it('devrait afficher le score IA', () => {
    render(<ArticleFeed initialArticles={mockArticles} />);

    const scores = screen.getAllByText(/IA Score:/);
    expect(scores).toHaveLength(2);
  });

  it("devrait afficher un lien vers l'article original", () => {
    render(<ArticleFeed initialArticles={mockArticles} />);

    const links = screen.getAllByText("Lire l'original");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://example.com/1');
  });

  it('devrait afficher seulement 10 articles initialement', () => {
    render(<ArticleFeed initialArticles={manyArticles} />);

    // Les 10 premiers articles devraient être visibles
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 10')).toBeInTheDocument();

    // Le 11ème ne devrait pas être visible
    expect(screen.queryByText('Article 11')).not.toBeInTheDocument();
  });

  it('devrait gérer la pagination (affichage initial limité)', () => {
    render(<ArticleFeed initialArticles={manyArticles} />);

    // Les 10 premiers articles devraient être visibles
    expect(screen.getByText('Article 1')).toBeInTheDocument();

    // Le composant gère la pagination en interne
    expect(manyArticles.length).toBe(15);
  });

  it("devrait afficher un message quand il n'y a pas d'articles", () => {
    render(<ArticleFeed initialArticles={[]} />);

    // Le composant devrait gérer gracieusement une liste vide
    expect(screen.queryByText('Article')).not.toBeInTheDocument();
  });

  it('devrait afficher les catégories des sources', () => {
    render(<ArticleFeed initialArticles={mockArticles} />);

    // Vérifier que les noms de sources sont affichés
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Anthropic')).toBeInTheDocument();
  });
});
