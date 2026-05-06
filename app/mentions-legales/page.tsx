import { NavbarWrapper } from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <NavbarWrapper />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 md:py-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-8">
          Mentions Légales
        </h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">
              1. Éditeur du site
            </h2>
            <p>
              Le site <strong>Sema</strong> (accessible à l'adresse
              https://sema-mocha.vercel.app) est édité par :<br />
              <strong>Fourfooz Luca</strong>
              <br />
              27380 Fleury sur Andelle
              <br />
              Email de contact : Luca.ffz@icloud.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">
              2. Hébergement
            </h2>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>
              <br />
              340 S Lemon Ave #4133
              <br />
              Walnut, CA 91789, États-Unis
              <br />
              Site web : vercel.com
            </p>
            <p className="mt-2">
              La base de données est hébergée par{' '}
              <strong>Neon Serverless Postgres</strong> (AWS/Google Cloud,
              région Europe).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">
              3. Propriété intellectuelle
            </h2>
            <p>
              Sema est un agrégateur de contenus. Les titres, résumés et liens
              redirigent vers des articles appartenant à leurs auteurs et
              éditeurs respectifs. Le résumé généré par l'IA de Sema relève du
              droit de courte citation et d'analyse algorithmique.
            </p>
            <p className="mt-2">
              Si vous êtes l'éditeur d'un site source et souhaitez être retiré
              de notre système d'agrégation, veuillez nous contacter à l'adresse
              email mentionnée ci-dessus. Le retrait sera effectué sous 48h.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
