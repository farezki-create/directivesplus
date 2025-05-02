
import { Header } from "@/components/Header";
import { FrenchFlag } from "@/components/ui/FrenchFlag";

export default function RGPD() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">Mentions légales et politique de confidentialité</h1>
          
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Éditeur de l'application</h2>
              <p className="text-gray-700">Médecin domicilié en France, inscrit à l'ordre des médecins et tenu par le secret médical et la vie privée (Article 4 du code de la santé publique)</p>
              <p className="text-gray-700 mt-2">Email de contact : <a href="mailto:contact@directivesplus.fr" className="text-blue-600 hover:underline">contact@directivesplus.fr</a></p>
              <p className="text-gray-700 mt-2">Accès professionnel : par code donné par le patient</p>
              <p className="text-gray-700 mt-2">Conservation : 10 ans après inactivité</p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Hébergement de l'application et des données de santé</h2>
              <div className="flex items-center gap-2 mb-2">
                <p className="font-medium">100% sécurisé en France</p>
                <FrenchFlag />
              </div>
              <p className="text-gray-700">Scalingo – Hébergeur certifié HDS</p>
              <p className="text-gray-700 mt-1">Adresse : 15 avenue du Rhin, 67100 Strasbourg, France</p>
              <p className="text-gray-700 mt-1">Site : <a href="https://scalingo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://scalingo.com</a></p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Propriété intellectuelle</h2>
              <p className="text-gray-700">Tous les contenus (textes, images, logo, structure) de l'application sont la propriété exclusive de DirectivesPlus, sauf mentions contraires.</p>
              <p className="text-gray-700 mt-2">Toute reproduction totale ou partielle est interdite sans autorisation préalable.</p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Responsabilité</h2>
              <p className="text-gray-700">L'éditeur ne peut être tenu responsable d'un mauvais usage de l'application ou d'un accès non autorisé aux documents médicaux transmis volontairement par un utilisateur.</p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Politique de cookies</h2>
              <p className="text-gray-700">DirectivesPlus utilise uniquement des cookies nécessaires au bon fonctionnement de l'application (connexion, sécurité). Aucun cookie publicitaire ou de traçage n'est utilisé.</p>
            </section>
          </div>
          
          {/* Security info section */}
          <div className="mt-12 text-center text-sm text-muted-foreground flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">100% sécurisé</span>
              <FrenchFlag />
            </div>
            <p>
              Vos directives anticipées et documents de santé sont hébergés en France 
              dans le serveur Scalingo, certifiés HDS par les autorités de santé.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
