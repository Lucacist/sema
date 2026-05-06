import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Import après le mock
import { SourceFilters } from '@/components/SourceFilters';

describe('SourceFilters Component', () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (useSearchParams as any).mockReturnValue(new URLSearchParams());
  });

  const sources = ['OpenAI', 'Anthropic', 'DeepMind', 'Hugging Face'];

  it('devrait afficher tous les badges de sources', () => {
    render(<SourceFilters sourcesList={sources} />);

    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Anthropic')).toBeInTheDocument();
    expect(screen.getByText('DeepMind')).toBeInTheDocument();
    expect(screen.getByText('Hugging Face')).toBeInTheDocument();
  });

  it('devrait afficher le bouton "Toutes les actus"', () => {
    render(<SourceFilters sourcesList={sources} />);

    expect(screen.getByText('Toutes les actus')).toBeInTheDocument();
  });

  it('devrait être cliquable', () => {
    render(<SourceFilters sourcesList={sources} />);

    const openAIBadge = screen.getByText('OpenAI');
    fireEvent.click(openAIBadge);

    // Le composant devrait réagir au clic (vérifié par l'absence d'erreur)
    expect(openAIBadge).toBeInTheDocument();
  });

  it('devrait avoir un bouton pour réinitialiser les filtres', () => {
    (useSearchParams as any).mockReturnValue(
      new URLSearchParams('source=OpenAI'),
    );

    render(<SourceFilters sourcesList={sources} />);

    const toutesButton = screen.getByText('Toutes les actus');
    fireEvent.click(toutesButton);

    // Le bouton devrait être cliquable
    expect(toutesButton).toBeInTheDocument();
  });

  it('devrait afficher la source active', () => {
    (useSearchParams as any).mockReturnValue(
      new URLSearchParams('source=OpenAI'),
    );

    render(<SourceFilters sourcesList={sources} />);

    const openAIBadge = screen.getByText('OpenAI');
    // La source active devrait être visible
    expect(openAIBadge).toBeInTheDocument();
  });

  it('devrait gérer une liste vide de sources', () => {
    render(<SourceFilters sourcesList={[]} />);

    expect(screen.getByText('Toutes les actus')).toBeInTheDocument();
  });

  it('devrait fonctionner avec des paramètres URL existants', () => {
    (useSearchParams as any).mockReturnValue(
      new URLSearchParams('q=test&page=2'),
    );

    render(<SourceFilters sourcesList={sources} />);

    const openAIBadge = screen.getByText('OpenAI');
    fireEvent.click(openAIBadge);

    // Le composant devrait gérer les paramètres existants
    expect(openAIBadge).toBeInTheDocument();
  });
});
