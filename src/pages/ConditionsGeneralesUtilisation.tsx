
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";

const ConditionsGeneralesUtilisation = () => {
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
            Conditions Générales d'Utilisation - DirectivesPlus
          </h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">🔷 CONDITIONS GÉNÉRALES D'UTILISATION (CGU)</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-2">1. Objet</h3>
            <p>Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation de l'application DirectivesPlus par tout utilisateur (patient ou professionnel de santé).</p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">2. Accès au service</h3>
            <p>Le service est accessible :</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Aux utilisateurs qui créent un compte personnel sécurisé,</li>
              <li>Aux professionnels de santé disposant d'un code d'accès temporaire généré par le patient.</li>
            </ul>
            <p>L'accès aux données médicales se fait uniquement via ce code sécurisé.</p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">3. Nature du service</h3>
            <p>DirectivesPlus permet aux utilisateurs :</p>
            <ul className="list-disc pl-5 mb-4">
              <li>De rédiger leurs directives anticipées,</li>
              <li>De stocker des documents médicaux,</li>
              <li>De gérer l'accès à ces documents par des tiers de confiance ou professionnels.</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-6 mb-2">4. Données personnelles</h3>
            <p>Les données personnelles et de santé sont traitées conformément à la Politique de confidentialité, dans le respect du RGPD. L'utilisateur est responsable de la véracité et de l'actualisation de ses informations.</p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">5. Obligations de l'utilisateur</h3>
            <p>L'utilisateur s'engage à :</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Ne pas partager ses identifiants ou codes d'accès sans précaution,</li>
              <li>Utiliser l'application de manière conforme à sa finalité médicale et éthique,</li>
              <li>Ne pas compromettre la sécurité ou l'intégrité du service.</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-6 mb-2">6. Durée et résiliation</h3>
            <p>L'accès à l'application est valable tant que le compte est actif. Le compte peut être supprimé à tout moment par l'utilisateur. La suppression entraîne l'effacement de toutes les données stockées (dans un délai maximal de 30 jours, sauf obligations légales).</p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">7. Responsabilités de l'éditeur</h3>
            <p>L'éditeur s'engage à fournir un service sécurisé et conforme aux normes HDS. En cas d'anomalie technique ou de faille de sécurité, il prendra toutes les mesures nécessaires pour corriger les dysfonctionnements dans les meilleurs délais.</p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">8. Modification des CGU</h3>
            <p>Les CGU peuvent être mises à jour à tout moment. En cas de modification majeure, les utilisateurs seront informés à leur prochaine connexion.</p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">9. Droit applicable</h3>
            <p>Les présentes CGU sont soumises au droit français. En cas de litige, une tentative de médiation sera proposée avant toute action judiciaire.</p>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default ConditionsGeneralesUtilisation;
