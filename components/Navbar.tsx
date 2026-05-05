import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Logo / Titre */}
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Sema<span className="text-blue-600">.</span>
          </span>
        </div>

        {/* Barre de recherche style portfolio */}
        <div className="relative hidden sm:block w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher une actu, une technologie..."
            className="w-full pl-9 bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 rounded-full"
          />
        </div>
      </div>
    </nav>
  );
}
