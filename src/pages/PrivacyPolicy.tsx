
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
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
          Politique de Confidentialité – DirectivesPlus
        </h1>
        
        <div className="prose max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introduction</h2>
            <p className="mb-2">
              L'application DirectivesPlus respecte la vie privée de ses utilisateurs et s'engage à protéger les données personnelles et médicales collectées dans le cadre de l'utilisation de ses services. Cette politique explique quelles données sont collectées, comment elles sont utilisées, et quels droits vous avez sur celles-ci.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Responsable du traitement</h2>
            <p className="mb-2">Le responsable du traitement est :</p>
            <p className="mb-2">
              M. A.F.<br/>
              Médecin Anesthésiste-Réanimateur<br/>
              Médecin en Éthique en Santé<br/>
              Médecin en Douleur Chronique<br/>
              Contact : contact@directivesplus.fr
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Données collectées</h2>
            <p className="mb-2">Les données personnelles et médicales collectées incluent :</p>
            <ul className="list-disc pl-6 mb-3">
              <li>Nom, prénom, date de naissance</li>
              <li>Adresse e-mail</li>
              <li>Données de santé renseignées par l'utilisateur (directives anticipées, documents médicaux, etc.)</li>
              <li>Codes d'accès et historiques de partage</li>
              <li>Traces d'accès et de connexions</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Finalité du traitement</h2>
            <p className="mb-2">Les données sont traitées exclusivement pour les finalités suivantes :</p>
            <ul className="list-disc pl-6 mb-3">
              <li>Création et gestion d'un espace personnel de santé</li>
              <li>Rédaction, modification et stockage des directives anticipées</li>
              <li>Téléversement, conservation et partage de documents médicaux</li>
              <li>Génération de codes d'accès destinés à des professionnels de santé ou à des institutions</li>
              <li>Sécurisation des accès et traçabilité</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Base légale</h2>
            <p className="mb-2">
              Le traitement des données repose sur le consentement explicite de l'utilisateur. Ce consentement peut être retiré à tout moment via l'espace personnel ou en écrivant à l'adresse de contact ci-dessus.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Conservation des données</h2>
            <p className="mb-2">
              Les données personnelles et médicales sont conservées pendant 10 ans après la dernière activité sur le compte, sauf demande de suppression anticipée par l'utilisateur. Après ce délai, les données sont supprimées de manière sécurisée.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Hébergement et sécurité</h2>
            <p className="mb-2">Les données sont hébergées exclusivement en France par :</p>
            <p className="mb-2">
              Scalingo SAS<br/>
              Hébergeur certifié HDS (Hébergeur de Données de Santé)<br/>
              Site : https://scalingo.com
            </p>
            <p className="mb-2">
              Des mesures techniques et organisationnelles strictes sont mises en place pour assurer la sécurité, l'intégrité et la confidentialité des données.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Partage des données</h2>
            <p className="mb-2">
              Les données ne sont jamais partagées avec des tiers sans votre accord explicite.
            </p>
            <p className="mb-2">
              Vous avez la possibilité de générer un code de partage temporaire que vous pouvez transmettre à un professionnel de santé ou à une institution. Ce code permet d'accéder uniquement aux documents autorisés par vos soins.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">9. Vos droits</h2>
            <p className="mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 mb-3">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d'opposition</li>
              <li>Droit à la portabilité des données</li>
            </ul>
            <p className="mb-2">
              Vous pouvez exercer ces droits à tout moment en envoyant un message à contact@directivesplus.fr.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">10. Réclamations</h2>
            <p className="mb-2">
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de l'autorité compétente :
            </p>
            <p className="mb-2">
              CNIL – Commission Nationale de l'Informatique et des Libertés<br/>
              Site : https://www.cnil.fr
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">11. Mise à jour de la politique</h2>
            <p className="mb-2">
              Cette politique de confidentialité est susceptible d'être modifiée pour refléter l'évolution législative, réglementaire ou technique. En cas de modification significative, les utilisateurs seront informés dans l'application ou par email.
            </p>
            <p className="mb-2">
              <strong>Dernière mise à jour : mai 2025</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
