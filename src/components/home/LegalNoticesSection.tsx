
import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { FrenchFlag } from "@/components/ui/FrenchFlag";

export function LegalNoticesSection() {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {currentLanguage === 'fr' ? 'Mentions légales' : 'Legal Notices'}
      </h2>
      
      <div className="space-y-6">
        <Card className="p-4 bg-blue-50">
          <h3 className="font-semibold text-lg mb-3">
            {currentLanguage === 'fr' ? 'Éditeur de l\'application :' : 'Application Publisher:'}
          </h3>
          
          <div className="space-y-2 text-sm">
            <p>
              {currentLanguage === 'fr' 
                ? 'Nom : médecin domicilié en France, inscrit à l\'ordre des médecins et tenu par le secret médical et la vie privée (Article 4 - article R.4127-4 du code de la santé publique).'
                : 'Name: physician domiciled in France, registered with the medical association and bound by medical confidentiality and privacy (Article 4 - article R.4127-4 of the public health code).'}
            </p>
            <p>
              {currentLanguage === 'fr' 
                ? 'Adresse : 57200 Sarreguemines, France (adresse masquée)'
                : 'Address: 57200 Sarreguemines, France (hidden address)'}
            </p>
            <p>
              {currentLanguage === 'fr' 
                ? 'Email de contact : '
                : 'Contact email: '}
              <a href="mailto:contact@directivesplus.fr" className="text-blue-600 hover:underline">
                contact@directivesplus.fr
              </a>
            </p>
            <p>
              {currentLanguage === 'fr' 
                ? 'Accès professionnel : par code donné par le patient'
                : 'Professional access: by code provided by the patient'}
            </p>
            <p>
              {currentLanguage === 'fr' 
                ? 'Conservation : 10 ans après inactivité'
                : 'Data retention: 10 years after inactivity'}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-3">
            {currentLanguage === 'fr' 
              ? 'Hébergement de l\'application et des données de santé:' 
              : 'Application and health data hosting:'}
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">{currentLanguage === 'fr' ? 'En France' : 'In France'}</span>
              <FrenchFlag />
            </div>
            <p>
              {currentLanguage === 'fr' 
                ? 'Scalingo – Hébergeur certifié HDS'
                : 'Scalingo – HDS certified hosting provider'}
            </p>
            <p>
              {currentLanguage === 'fr' 
                ? 'Adresse : 15 avenue du Rhin, 67100 Strasbourg, France'
                : 'Address: 15 avenue du Rhin, 67100 Strasbourg, France'}
            </p>
            <p>
              {currentLanguage === 'fr' ? 'Site : ' : 'Website: '}
              <a href="https://scalingo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                https://scalingo.com
              </a>
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-3">
            {currentLanguage === 'fr' ? 'Propriété intellectuelle :' : 'Intellectual Property:'}
          </h3>
          
          <div className="space-y-2 text-sm">
            <p>
              {currentLanguage === 'fr' 
                ? 'Tous les contenus (textes, images, logo, structure) de l\'application sont la propriété exclusive de DirectivesPlus, sauf mentions contraires.'
                : 'All content (texts, images, logo, structure) of the application are the exclusive property of DirectivesPlus, unless otherwise stated.'}
            </p>
            <p>
              {currentLanguage === 'fr' 
                ? 'Toute reproduction totale ou partielle est interdite sans autorisation préalable.'
                : 'Any total or partial reproduction is prohibited without prior authorization.'}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-3">
            {currentLanguage === 'fr' ? 'Responsabilité :' : 'Liability:'}
          </h3>
          
          <div className="space-y-2 text-sm">
            <p>
              {currentLanguage === 'fr' 
                ? 'L\'éditeur ne peut être tenu responsable d\'un mauvais usage de l\'application ou d\'un accès non autorisé aux documents médicaux transmis volontairement par un utilisateur.'
                : 'The publisher cannot be held responsible for misuse of the application or unauthorized access to medical documents voluntarily transmitted by a user.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
