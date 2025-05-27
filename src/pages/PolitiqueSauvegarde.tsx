
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";

const PolitiqueSauvegarde = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-directiveplus-800">
            Politique de Sauvegarde – DirectivesPlus
          </h1>
          
          <div className="prose max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Objectif</h2>
              <p className="mb-4">
                La politique de sauvegarde de DirectivesPlus vise à garantir la continuité de service et la protection des données de santé en cas d'incident technique, de panne matérielle ou de sinistre.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Fréquence des sauvegardes</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Sauvegardes automatiques :</strong> Toutes les 6 heures</li>
                <li><strong>Sauvegardes complètes :</strong> Quotidiennes à 2h00 du matin</li>
                <li><strong>Sauvegardes de sécurité :</strong> Hebdomadaires (conservées 3 mois)</li>
                <li><strong>Sauvegardes d'archivage :</strong> Mensuelles (conservées 12 mois)</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Données sauvegardées</h2>
              <p className="mb-2">Les sauvegardes incluent :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Base de données complète (profils utilisateurs, directives, documents)</li>
                <li>Fichiers et documents téléchargés par les utilisateurs</li>
                <li>Configurations système et de sécurité</li>
                <li>Logs de sécurité et d'audit</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Localisation et sécurité</h2>
              <p className="mb-4">
                Les sauvegardes sont stockées sur des serveurs séparés, géographiquement distants du serveur principal, dans des centres de données certifiés HDS en France. Toutes les sauvegardes sont chiffrées avec un algorithme AES-256.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Tests de restauration</h2>
              <p className="mb-4">
                Des tests de restauration sont effectués mensuellement pour vérifier l'intégrité des sauvegardes et s'assurer que les procédures de récupération fonctionnent correctement.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Temps de récupération</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>RTO (Recovery Time Objective) :</strong> Maximum 4 heures</li>
                <li><strong>RPO (Recovery Point Objective) :</strong> Maximum 6 heures de perte de données</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Responsabilités</h2>
              <p className="mb-4">
                L'hébergeur Scalingo assure la gestion technique des sauvegardes. L'éditeur de DirectivesPlus supervise les procédures et effectue les contrôles qualité.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Plan de continuité d'activité</h2>
              <p className="mb-4">
                En cas d'incident majeur, un plan de continuité d'activité est activé avec notification immédiate des utilisateurs et mise en place de solutions temporaires si nécessaire.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default PolitiqueSauvegarde;
