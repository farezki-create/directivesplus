
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";

const Confidentialite = () => {
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
            Politique de Confidentialité et Protection des Données de Santé
          </h1>
          
          <div className="prose max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introduction</h2>
              <p className="mb-2">
                DirectivesPlus s'engage à protéger vos données de santé conformément aux exigences du Règlement Général sur la Protection des Données (RGPD), 
                de la Loi Informatique et Libertés, et du cadre réglementaire relatif à l'Hébergement des Données de Santé (HDS).
              </p>
              <p className="mb-2">
                Nous sommes certifiés/en cours de certification pour l'Hébergement des Données de Santé (HDS), garantissant le plus haut niveau de protection 
                pour vos informations médicales et directives anticipées.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Données collectées</h2>
              <p className="mb-2">Nous collectons et traitons les catégories de données suivantes :</p>
              <ul className="list-disc pl-6 mb-3">
                <li>Données d'identification (nom, prénom, date de naissance)</li>
                <li>Coordonnées (adresse, téléphone, email)</li>
                <li>Données de santé (directives anticipées, données médicales)</li>
                <li>Personnes de confiance et leurs coordonnées</li>
                <li>Informations d'authentification et de sécurité</li>
              </ul>
              <p className="mb-2">
                Ces données sont nécessaires pour fournir nos services et respecter nos obligations légales relatives aux directives anticipées.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Finalités du traitement</h2>
              <p className="mb-2">Vos données sont traitées pour les finalités suivantes :</p>
              <ul className="list-disc pl-6 mb-3">
                <li>Création et gestion de vos directives anticipées</li>
                <li>Stockage sécurisé de vos données médicales</li>
                <li>Accès contrôlé à vos informations par les personnes autorisées</li>
                <li>Respect des obligations légales relatives à la conservation des données de santé</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Hébergement sécurisé des données de santé</h2>
              <p className="mb-2">
                Conformément à la réglementation, vos données de santé sont hébergées chez un hébergeur certifié HDS 
                (Hébergement des Données de Santé) garantissant :
              </p>
              <ul className="list-disc pl-6 mb-3">
                <li>Un niveau élevé de disponibilité</li>
                <li>L'intégrité des données stockées</li>
                <li>La confidentialité des informations</li>
                <li>La traçabilité des accès et des actions</li>
                <li>L'authentification des personnes accédant aux données</li>
              </ul>
              <p className="mb-2">
                Notre infrastructure est régulièrement auditée et répond aux exigences de la norme ISO 27001 et du référentiel HDS.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Durée de conservation</h2>
              <p className="mb-2">
                Conformément à la réglementation, vos données de santé et directives anticipées sont conservées pendant la durée légale applicable, 
                soit jusqu'à votre retrait de consentement ou pendant une période de 10 ans après le dernier accès.
              </p>
              <p className="mb-2">
                Les journaux d'accès et d'utilisation sont conservés pendant 3 ans à des fins de traçabilité et de sécurité.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Mesures de sécurité</h2>
              <p className="mb-2">Nous mettons en œuvre des mesures de sécurité avancées :</p>
              <ul className="list-disc pl-6 mb-3">
                <li>Chiffrement des données sensibles</li>
                <li>Authentification forte multi-facteurs</li>
                <li>Journalisation exhaustive des accès</li>
                <li>Contrôle d'accès basé sur les rôles</li>
                <li>Procédures de sauvegarde et de restauration sécurisées</li>
                <li>Plans de continuité d'activité</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Droits des personnes</h2>
              <p className="mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 mb-3">
                <li>Droit d'accès et de rectification de vos données</li>
                <li>Droit à l'effacement dans les limites légales</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit de retirer votre consentement à tout moment</li>
              </ul>
              <p className="mb-2">
                Pour exercer ces droits, contactez notre Délégué à la Protection des Données : dpo@directivesplus.fr
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Notification des violations</h2>
              <p className="mb-2">
                En cas de violation de données susceptible d'engendrer un risque pour vos droits et libertés, 
                nous nous engageons à vous en informer dans les 72 heures, conformément au RGPD.
              </p>
              <p className="mb-2">
                Nous notifierons également la CNIL et les autorités compétentes selon les procédures en vigueur.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">9. Transferts de données</h2>
              <p className="mb-2">
                Vos données de santé sont exclusivement hébergées et traitées en France sur des infrastructures 
                certifiées HDS, conformément à la réglementation.
              </p>
              <p className="mb-2">
                Aucun transfert de données hors Union Européenne n'est effectué.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">10. Mise à jour de la politique</h2>
              <p className="mb-2">
                Cette politique de confidentialité est régulièrement mise à jour pour refléter les évolutions 
                réglementaires et de nos pratiques. La version la plus récente est disponible sur notre site.
              </p>
              <p className="mb-2">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">11. Contact</h2>
              <p className="mb-2">
                Pour toute question relative à la protection de vos données, vous pouvez contacter :
              </p>
              <p className="mb-2">
                <strong>Délégué à la Protection des Données</strong><br />
                Email : dpo@directivesplus.fr<br />
                Téléphone : 01 XX XX XX XX<br />
                Adresse : XX rue XXXXX, XXXXX, France
              </p>
              <p className="mb-2">
                Vous avez également le droit d'introduire une réclamation auprès de la CNIL : www.cnil.fr
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Confidentialite;
