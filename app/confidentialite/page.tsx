import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Confidentialite() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 md:py-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mb-8">
          Politique de Confidentialité
        </h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <p className="font-medium text-zinc-900">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">
              1. Collecte des données personnelles
            </h2>
            <p>
              C'est très simple :{' '}
              <strong>Sema ne collecte aucune donnée personnelle.</strong>
              <br />
              Nous n'avons pas de système de création de compte, de newsletter,
              ou de formulaire nécessitant vos données personnelles. Vous pouvez
              naviguer sur Sema de manière totalement anonyme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">
              2. Cookies et traceurs
            </h2>
            <p>
              Sema n'utilise aucun cookie publicitaire ou de pistage. Les seuls
              "cookies" ou données de stockage local (Local Storage)
              éventuellement utilisés par le site sont strictement nécessaires à
              son fonctionnement technique (par exemple, mémoriser vos
              préférences d'interface ou l'état de la barre de recherche). Ces
              données ne quittent jamais votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">
              3. Liens externes
            </h2>
            <p>
              Notre site contient des liens redirigeant vers des sites web
              externes (TechCrunch, The Verge, OpenAI, etc.). Nous n'avons aucun
              contrôle sur le contenu et les pratiques de confidentialité de ces
              sites. Nous vous encourageons à consulter leurs politiques de
              confidentialité respectives lorsque vous quittez Sema.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">4. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité,
              vous pouvez nous contacter à :{' '}
              <strong>luca.ffz@icloud.com</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
