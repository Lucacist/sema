'use client';

import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams } from 'next/navigation';

export function SourceFilters({ sourcesList }: { sourcesList: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSource = searchParams.get('source'); // La source actuellement sélectionnée

  function toggleSource(sourceName: string) {
    const params = new URLSearchParams(searchParams);
    // Si on clique sur la source déjà active, on la désélectionne
    if (currentSource === sourceName) {
      params.delete('source');
    } else {
      params.set('source', sourceName);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Badge
        variant={!currentSource ? 'default' : 'outline'}
        className="cursor-pointer hover:bg-zinc-800 transition-colors"
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.delete('source');
          router.push(`/?${params.toString()}`);
        }}
      >
        Toutes les actus
      </Badge>

      {sourcesList.map((source) => (
        <Badge
          key={source}
          variant={currentSource === source ? 'default' : 'outline'}
          className={`cursor-pointer transition-colors ${
            currentSource === source
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => toggleSource(source)}
        >
          {source}
        </Badge>
      ))}
    </div>
  );
}
