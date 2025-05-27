
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";

const AnalyseImpactProtectionDonnees = () => {
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
            Analyse d'Impact sur la Protection des Données (AIPD)
          </h1>
          
          <div className="prose max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Contexte et objectif</h2>
              <p className="mb-4">
                Cette Analyse d'Impact sur la Protection des Données (AIPD) a été réalisée conformément à l'article 35 du RGPD pour évaluer les risques liés au traitement de données de santé par l'application DirectivesPlus.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Description du traitement</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Finalités du traitement
                </h3>
                <ul className="list-disc pl-6 text-blue-700">
                  <li>Rédaction et stockage de directives anticipées</li>
                  <li>Gestion de documents médicaux personnels</li>
                  <li>Partage sécurisé avec des professionnels de santé</li>
                  <li>Génération de codes d'accès temporaires</li>
                </ul>
              </div>

              <h3 className="font-medium mb-2">Catégories de données traitées :</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Données d'identification (nom, prénom, date de naissance)</li>
                <li>Données de contact (email, téléphone, adresse)</li>
                <li>Données de santé (directives anticipées, documents médicaux)</li>
                <li>Données de connexion (logs, historiques d'accès)</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Évaluation des risques</h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Risques faibles</h3>
                  <ul className="list-disc pl-6 text-green-700">
                    <li>Accès non autorisé aux données (mesures de sécurité robustes)</li>
                    <li>Perte de données (sauvegardes multiples et redondantes)</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Risques modérés</h3>
                  <ul className="list-disc pl-6 text-yellow-700">
                    <li>Partage involontaire de codes d'accès par les utilisateurs</li>
                    <li>Utilisation de mots de passe faibles</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Mesures de protection mises en place</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Mesures techniques
                </h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Chiffrement AES-256 de toutes les données sensibles</li>
                  <li>Authentification à deux facteurs disponible</li>
                  <li>Hébergement HDS certifié en France</li>
                  <li>Sauvegardes automatiques et chiffrées</li>
                  <li>Monitoring et logs de sécurité</li>
                  <li>Codes d'accès temporaires avec expiration</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Mesures organisationnelles
                </h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Politique de sécurité documentée</li>
                  <li>Formation du personnel aux enjeux RGPD</li>
                  <li>Procédures de gestion des incidents</li>
                  <li>Contrôles d'accès stricts</li>
                  <li>Audits de sécurité réguliers</li>
                </ul>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Droits des personnes concernées</h2>
              <p className="mb-2">L'application garantit l'exercice de tous les droits RGPD :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Droit d'accès : consultation de toutes les données</li>
                <li>Droit de rectification : modification via l'interface utilisateur</li>
                <li>Droit à l'effacement : suppression complète du compte</li>
                <li>Droit à la portabilité : export des données au format PDF</li>
                <li>Droit d'opposition : désactivation de certains traitements</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Conclusion de l'analyse</h2>
              <p className="mb-4">
                L'analyse démontre que le traitement de données par DirectivesPlus présente un niveau de risque <strong>acceptable</strong> grâce aux mesures de protection mises en place. Le traitement est conforme aux exigences du RGPD et répond à un besoin légitime d'amélioration de la prise en charge médicale.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Recommandations</h3>
                <ul className="list-disc pl-6 text-blue-700">
                  <li>Maintenir la formation continue du personnel</li>
                  <li>Effectuer des audits de sécurité trimestriels</li>
                  <li>Sensibiliser les utilisateurs aux bonnes pratiques</li>
                  <li>Réviser cette AIPD annuellement</li>
                </ul>
              </div>
            </section>

            <section className="mb-6">
              <p className="text-sm text-gray-600">
                <strong>Dernière mise à jour :</strong> Mai 2025<br/>
                <strong>Prochaine révision :</strong> Mai 2026
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default AnalyseImpactProtectionDonnees;
