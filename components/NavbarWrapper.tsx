import { Suspense } from 'react';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <Navbar />
    </Suspense>
  );
}

function NavbarSkeleton() {
  return (
    <nav className="border-b border-gray-100 bg-stone-100/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Sema<span className="text-blue-600">.</span>
          </span>
        </div>
        <div className="relative hidden sm:block w-72">
          <div className="w-full h-10 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
    </nav>
  );
}
