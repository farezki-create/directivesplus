
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DataProtectionImpact = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="flex items-center mb-6 text-gray-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Analyse d'Impact relative à la Protection des Données (AIPD)
        </h1>
        
        <div className="prose max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introduction et contexte</h2>
            <p className="mb-2">
              Cette Analyse d'Impact relative à la Protection des Données (AIPD) a été réalisée conformément aux exigences du Règlement Général sur la Protection des Données (RGPD) 
              et spécifiquement à son article 35, qui exige une telle analyse lorsqu'un traitement est susceptible d'engendrer un risque élevé pour les droits et libertés des personnes.
            </p>
            <p className="mb-2">
              DirectivesPlus traite des données de santé, considérées comme "sensibles" au sens du RGPD, et a donc l'obligation de réaliser cette AIPD.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Description des opérations de traitement</h2>
            
            <Card className="p-4 border border-gray-200 mb-4">
              <h3 className="font-medium mb-2">Nature des traitements</h3>
              <ul className="list-disc pl-6 mb-2">
                <li>Collecte et enregistrement des directives anticipées des utilisateurs</li>
                <li>Stockage sécurisé des données médicales</li>
                <li>Partage contrôlé des informations via codes d'accès</li>
                <li>Journalisation des accès aux données</li>
              </ul>
            </Card>
            
            <Card className="p-4 border border-gray-200 mb-4">
              <h3 className="font-medium mb-2">Finalités</h3>
              <ul className="list-disc pl-6 mb-2">
                <li>Permettre aux utilisateurs de rédiger et stocker leurs directives anticipées</li>
                <li>Faciliter l'accès aux directives par le personnel médical autorisé en cas de besoin</li>
                <li>Garantir le respect des volontés des patients</li>
                <li>Répondre aux obligations légales relatives aux directives anticipées</li>
              </ul>
            </Card>
            
            <Card className="p-4 border border-gray-200 mb-4">
              <h3 className="font-medium mb-2">Données traitées</h3>
              <ul className="list-disc pl-6 mb-2">
                <li>Données d'identification: nom, prénom, date de naissance</li>
                <li>Coordonnées: adresse, téléphone, email</li>
                <li>Données de santé: directives anticipées, informations médicales</li>
                <li>Informations sur les personnes de confiance</li>
                <li>Données d'authentification et journaux d'accès</li>
              </ul>
            </Card>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Nécessité et proportionnalité</h2>
            <p className="mb-2">
              Le traitement de ces données est nécessaire pour l'accomplissement de la mission de DirectivesPlus, qui vise à permettre aux personnes d'exercer leur droit légal d'exprimer leurs volontés concernant leur fin de vie.
            </p>
            <p className="mb-2">
              La base légale du traitement est:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Le consentement explicite des utilisateurs (Art. 9.2.a du RGPD)</li>
              <li>L'exécution d'un contrat avec l'utilisateur (Art. 6.1.b du RGPD)</li>
              <li>Le respect d'une obligation légale relative aux directives anticipées (Art. 6.1.c du RGPD)</li>
            </ul>
            <p className="mb-2">
              La durée de conservation des données est limitée à ce qui est strictement nécessaire: soit jusqu'au retrait du consentement par l'utilisateur, soit pendant une période de 10 ans après le dernier accès, conformément aux obligations légales.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Risques pour les droits et libertés</h2>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Risque 1: Accès non autorisé aux données sensibles</h3>
              <p className="text-sm text-gray-700 mb-1"><strong>Impact potentiel:</strong> Élevé</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Probabilité:</strong> Moyenne</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Mesures d'atténuation:</strong> Authentification forte, chiffrement des données, contrôle d'accès strict, journalisation exhaustive.</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Risque 2: Perte ou corruption des directives anticipées</h3>
              <p className="text-sm text-gray-700 mb-1"><strong>Impact potentiel:</strong> Très élevé</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Probabilité:</strong> Faible</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Mesures d'atténuation:</strong> Sauvegardes régulières, procédures de restauration testées, infrastructure redondante.</p>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Risque 3: Violation de données personnelles</h3>
              <p className="text-sm text-gray-700 mb-1"><strong>Impact potentiel:</strong> Élevé</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Probabilité:</strong> Moyenne</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Mesures d'atténuation:</strong> Procédure de notification des violations, formation du personnel, surveillance continue des systèmes.</p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Mesures de sécurité</h2>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Organisationnelles:</strong> Politique d'accès basée sur les rôles, formation continue du personnel, procédures documentées</li>
              <li><strong>Techniques:</strong> Chiffrement de bout en bout, authentification multifacteur, journalisation complète, sauvegarde régulière</li>
              <li><strong>Juridiques:</strong> Clauses contractuelles avec les sous-traitants, engagement de confidentialité</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Conclusion et avis du DPO</h2>
            <p className="mb-2">
              L'analyse d'impact révèle que, bien que le traitement présente des risques significatifs, les mesures techniques et organisationnelles mises en place sont appropriées pour assurer la protection des données.
            </p>
            <p className="mb-2">
              Le Délégué à la Protection des Données a émis un avis favorable, sous réserve d'une revue annuelle de cette analyse et de l'application rigoureuse des mesures de protection identifiées.
            </p>
            <p className="mb-2">
              Date de validation de l'AIPD: {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Plan d'action</h2>
            <table className="min-w-full bg-white border border-gray-200 mb-4">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Action</th>
                  <th className="border border-gray-200 px-4 py-2">Responsable</th>
                  <th className="border border-gray-200 px-4 py-2">Délai</th>
                  <th className="border border-gray-200 px-4 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Mise en place du chiffrement de bout en bout</td>
                  <td className="border border-gray-200 px-4 py-2">DSI</td>
                  <td className="border border-gray-200 px-4 py-2">Complété</td>
                  <td className="border border-gray-200 px-4 py-2 text-green-600">Validé</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Amélioration de la journalisation des accès</td>
                  <td className="border border-gray-200 px-4 py-2">Équipe Technique</td>
                  <td className="border border-gray-200 px-4 py-2">Complété</td>
                  <td className="border border-gray-200 px-4 py-2 text-green-600">Validé</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Formation du personnel à la protection des données</td>
                  <td className="border border-gray-200 px-4 py-2">RH & DPO</td>
                  <td className="border border-gray-200 px-4 py-2">Continu</td>
                  <td className="border border-gray-200 px-4 py-2 text-amber-600">En cours</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Test des procédures de sauvegarde et restauration</td>
                  <td className="border border-gray-200 px-4 py-2">DSI</td>
                  <td className="border border-gray-200 px-4 py-2">Trimestriel</td>
                  <td className="border border-gray-200 px-4 py-2 text-amber-600">Planifié</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataProtectionImpact;
