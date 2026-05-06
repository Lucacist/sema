'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fonction qui met à jour l'URL à chaque lettre tapée
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    // "replace" met à jour l'URL sans créer un nouvel historique de navigation
    router.replace(`/?${params.toString()}`);
  }

  return (
    <nav className="border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Sema<span className="text-blue-600">.</span>
          </span>
        </div>

        <div className="relative hidden sm:block w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher une actu, une IA..."
            className="w-full pl-9 bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-full"
            defaultValue={searchParams.get('q')?.toString() || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
}
