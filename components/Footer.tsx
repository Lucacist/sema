import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Sema. L'essentiel de l'IA.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <Link
            href="/mentions-legales"
            className="hover:text-zinc-900 transition-colors"
          >
            Mentions Légales
          </Link>
          <Link
            href="/confidentialite"
            className="hover:text-zinc-900 transition-colors"
          >
            Confidentialité
          </Link>
          <a
            href="mailto:luca.ffz@icloud.com"
            className="hover:text-zinc-900 transition-colors"
          >
            Signaler un article
          </a>
        </div>
      </div>
    </footer>
  );
}
