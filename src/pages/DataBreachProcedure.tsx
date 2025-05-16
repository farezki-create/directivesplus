
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Clock, Users, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DataBreachProcedure = () => {
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
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Procédure de Notification en cas de Violation de Données
          </h1>
        </div>
        
        <div className="prose max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introduction</h2>
            <p className="mb-2">
              Cette procédure définit les étapes à suivre en cas de violation de données personnelles, conformément aux exigences 
              du Règlement Général sur la Protection des Données (RGPD) et particulièrement ses articles 33 et 34 relatifs à la notification 
              des violations aux autorités de contrôle et aux personnes concernées.
            </p>
            <p className="mb-2">
              Compte tenu de la nature sensible des données de santé traitées par DirectivesPlus, cette procédure est 
              d'une importance critique et doit être suivie rigoureusement par tous les membres de l'organisation.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Définition d'une violation de données</h2>
            <p className="mb-2">
              Une violation de données personnelles est une violation de la sécurité entraînant, de manière accidentelle ou illicite, 
              la destruction, la perte, l'altération, la divulgation non autorisée de données à caractère personnel transmises, conservées ou 
              traitées, ou l'accès non autorisé à de telles données.
            </p>
            
            <h3 className="font-medium mb-2">Types de violations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <Card className="p-3 border-red-200 bg-red-50">
                <h4 className="font-medium text-red-800 mb-2">Violation de confidentialité</h4>
                <p className="text-sm">Divulgation ou accès non autorisé aux données personnelles</p>
              </Card>
              <Card className="p-3 border-amber-200 bg-amber-50">
                <h4 className="font-medium text-amber-800 mb-2">Violation d'intégrité</h4>
                <p className="text-sm">Altération non autorisée des données personnelles</p>
              </Card>
              <Card className="p-3 border-blue-200 bg-blue-50">
                <h4 className="font-medium text-blue-800 mb-2">Violation de disponibilité</h4>
                <p className="text-sm">Perte d'accès ou destruction des données personnelles</p>
              </Card>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Équipe de gestion des incidents</h2>
            <p className="mb-2">
              L'équipe de gestion des incidents de violation de données est composée des membres suivants:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Délégué à la Protection des Données (DPO) - Coordinateur</li>
              <li>Directeur des Systèmes d'Information</li>
              <li>Responsable de la Sécurité des Systèmes d'Information</li>
              <li>Directeur Juridique</li>
              <li>Directeur de la Communication</li>
              <li>Médecin référent (pour les incidents impliquant des données de santé)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Procédure de notification étape par étape</h2>
            
            <div className="relative border-l-2 border-gray-300 pl-6 py-2 ml-4">
              <div className="absolute -left-3 top-0 bg-directiveplus-600 text-white rounded-full w-6 h-6 flex items-center justify-center">1</div>
              <h3 className="font-medium mb-2">Détection et signalement interne</h3>
              <p className="mb-2 text-sm">
                Toute personne qui détecte ou suspecte une violation de données doit immédiatement le signaler:
              </p>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>Par email à: <span className="text-blue-600">security@directivesplus.fr</span></li>
                <li>Par téléphone au: 01 XX XX XX XX (numéro d'urgence 24/7)</li>
              </ul>
              <p className="text-sm">
                Le signalement doit contenir toutes les informations disponibles sur l'incident.
              </p>
            </div>
            
            <div className="relative border-l-2 border-gray-300 pl-6 py-2 ml-4">
              <div className="absolute -left-3 top-0 bg-directiveplus-600 text-white rounded-full w-6 h-6 flex items-center justify-center">2</div>
              <h3 className="font-medium mb-2">Évaluation initiale</h3>
              <p className="mb-2 text-sm">
                Le DPO, avec le RSSI, procède à une évaluation initiale pour:
              </p>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>Confirmer s'il s'agit bien d'une violation de données personnelles</li>
                <li>Identifier la nature et l'étendue de la violation</li>
                <li>Évaluer les risques potentiels pour les personnes concernées</li>
              </ul>
              <p className="text-sm">
                Cette évaluation doit être réalisée dans les 24 heures suivant la détection de l'incident.
              </p>
            </div>
            
            <div className="relative border-l-2 border-gray-300 pl-6 py-2 ml-4">
              <div className="absolute -left-3 top-0 bg-directiveplus-600 text-white rounded-full w-6 h-6 flex items-center justify-center">3</div>
              <h3 className="font-medium mb-2">Confinement et remédiation</h3>
              <p className="mb-2 text-sm">
                L'équipe technique doit immédiatement:
              </p>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>Isoler les systèmes concernés</li>
                <li>Stopper la fuite de données si elle est en cours</li>
                <li>Sécuriser les systèmes pour prévenir d'autres fuites</li>
                <li>Préserver les preuves pour l'enquête</li>
              </ul>
            </div>
            
            <div className="relative border-l-2 border-gray-300 pl-6 py-2 ml-4">
              <div className="absolute -left-3 top-0 bg-directiveplus-600 text-white rounded-full w-6 h-6 flex items-center justify-center">4</div>
              <h3 className="font-medium mb-2">Notification à la CNIL</h3>
              <div className="flex items-start gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">
                  La notification à la CNIL doit être effectuée dans les 72 heures suivant la prise de connaissance de la violation si celle-ci est susceptible d'engendrer un risque pour les droits et libertés des personnes.
                </p>
              </div>
              <p className="mb-2 text-sm">
                La notification doit contenir:
              </p>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>La nature de la violation</li>
                <li>Les catégories et le nombre approximatif de personnes concernées</li>
                <li>Les catégories et le nombre approximatif de données concernées</li>
                <li>Les conséquences probables de la violation</li>
                <li>Les mesures prises ou envisagées pour remédier à la violation</li>
                <li>Les coordonnées du DPO ou d'un point de contact</li>
              </ul>
              <p className="text-sm mb-2">
                La notification se fait via le formulaire en ligne de la CNIL: <a href="https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles</a>
              </p>
            </div>
            
            <div className="relative border-l-2 border-gray-300 pl-6 py-2 ml-4">
              <div className="absolute -left-3 top-0 bg-directiveplus-600 text-white rounded-full w-6 h-6 flex items-center justify-center">5</div>
              <h3 className="font-medium mb-2">Information des personnes concernées</h3>
              <div className="flex items-start gap-2 mb-2">
                <Users className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                <p className="text-sm text-amber-600 font-medium">
                  Si la violation est susceptible d'engendrer un risque élevé pour les droits et libertés des personnes concernées, celles-ci doivent être informées dans les meilleurs délais.
                </p>
              </div>
              <p className="mb-2 text-sm">
                La communication doit:
              </p>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>Utiliser un langage clair et simple</li>
                <li>Décrire la nature de la violation</li>
                <li>Indiquer le nom et les coordonnées du DPO</li>
                <li>Décrire les conséquences probables de la violation</li>
                <li>Décrire les mesures prises ou envisagées</li>
                <li>Proposer des recommandations pour atténuer les effets négatifs</li>
              </ul>
              <p className="text-sm">
                L'information peut se faire par email, courrier postal, notification dans l'application, ou communication publique si contacter individuellement les personnes est impossible ou exigerait des efforts disproportionnés.
              </p>
            </div>
            
            <div className="relative border-l-2 border-gray-300 pl-6 py-2 ml-4">
              <div className="absolute -left-3 top-0 bg-directiveplus-600 text-white rounded-full w-6 h-6 flex items-center justify-center">6</div>
              <h3 className="font-medium mb-2">Documentation de la violation</h3>
              <div className="flex items-start gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  Toutes les violations doivent être documentées, même celles qui ne sont pas notifiées à la CNIL.
                </p>
              </div>
              <p className="mb-2 text-sm">
                La documentation doit inclure:
              </p>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>Les faits concernant la violation</li>
                <li>Les effets de la violation</li>
                <li>Les mesures correctives prises</li>
                <li>Le raisonnement qui a justifié les décisions prises (notification ou non)</li>
              </ul>
            </div>
            
            <div className="relative pl-6 py-2 ml-4">
              <div className="absolute -left-3 top-0 bg-directiveplus-600 text-white rounded-full w-6 h-6 flex items-center justify-center">7</div>
              <h3 className="font-medium mb-2">Analyse post-incident et amélioration</h3>
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  Une fois l'incident résolu, l'équipe doit se réunir pour analyser les causes et identifier les améliorations à apporter.
                </p>
              </div>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>Analyse des causes profondes de la violation</li>
                <li>Évaluation de l'efficacité de la réponse</li>
                <li>Identification des mesures préventives</li>
                <li>Mise à jour des procédures et des formations si nécessaire</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Critères pour la notification</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Violation nécessitant une notification à la CNIL</h3>
              <p className="text-sm mb-2">Une violation doit être notifiée si elle est susceptible d'engendrer un risque pour les droits et libertés des personnes, notamment:</p>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>Discrimination, vol ou usurpation d'identité</li>
                <li>Perte financière</li>
                <li>Atteinte à la réputation</li>
                <li>Perte de confidentialité des données protégées par le secret professionnel</li>
                <li>Désanonymisation</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-medium text-amber-800 mb-2">Violation nécessitant une communication aux personnes concernées</h3>
              <p className="text-sm mb-2">Une violation doit être communiquée aux personnes concernées si elle est susceptible d'engendrer un risque élevé pour leurs droits et libertés.</p>
              <p className="text-sm mb-2">Exceptions (art. 34.3 du RGPD) - La communication n'est pas nécessaire si:</p>
              <ul className="list-disc pl-6 mb-2 text-sm">
                <li>Les données étaient chiffrées ou rendues incompréhensibles</li>
                <li>Des mesures ont été prises pour que le risque ne soit plus susceptible de se matérialiser</li>
                <li>La communication exigerait des efforts disproportionnés</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Contacts et responsabilités</h2>
            <table className="min-w-full bg-white border border-gray-200 mb-4">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Rôle</th>
                  <th className="border border-gray-200 px-4 py-2">Contact</th>
                  <th className="border border-gray-200 px-4 py-2">Responsabilités</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Délégué à la Protection des Données</td>
                  <td className="border border-gray-200 px-4 py-2">dpo@directivesplus.fr<br/>01 XX XX XX XX</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Coordination générale</li>
                      <li>Notification à la CNIL</li>
                      <li>Information des personnes</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Responsable Sécurité</td>
                  <td className="border border-gray-200 px-4 py-2">rssi@directivesplus.fr<br/>01 XX XX XX XX</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Confinement technique</li>
                      <li>Analyse forensique</li>
                      <li>Remédiation technique</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Direction Juridique</td>
                  <td className="border border-gray-200 px-4 py-2">juridique@directivesplus.fr<br/>01 XX XX XX XX</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <ul className="list-disc pl-4 text-sm">
                      <li>Évaluation des risques juridiques</li>
                      <li>Conformité réglementaire</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataBreachProcedure;
