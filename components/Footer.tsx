export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Sema. Actualités IA filtrées.
        </p>
        <div className="flex gap-4 text-sm text-gray-500">
          <a href="#" className="hover:text-zinc-900 transition-colors">
            Politique de confidentialité
          </a>
          <a href="#" className="hover:text-zinc-900 transition-colors">
            Signaler un article
          </a>
        </div>
      </div>
    </footer>
  );
}
