
import { useLanguage } from "@/hooks/useLanguage";

export function AppInfoSection() {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {currentLanguage === 'fr' ? 'À propos de DirectivesPlus' : 'About DirectivesPlus'}
      </h2>
      
      {/* Step-by-step instructions */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">
          {currentLanguage === 'fr' ? 'Après connexion:' : 'After login:'}
        </h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>{currentLanguage === 'fr' ? 'Répondre aux 4 questionnaires.' : 'Answer the 4 questionnaires.'}</li>
          <li>{currentLanguage === 'fr' ? 'Rajouter aux choix, des phrases types.' : 'Add template phrases to your choices.'}</li>
          <li>{currentLanguage === 'fr' ? 'Désigner la personne de confiance.' : 'Designate your trusted person.'}</li>
          <li>{currentLanguage === 'fr' ? 'Consulter la synthèse.' : 'Review the summary.'}</li>
          <li>{currentLanguage === 'fr' ? 'Rajouter si besoin, un texte libre.' : 'Add free text if needed.'}</li>
          <li>{currentLanguage === 'fr' ? 'Enregistrer.' : 'Save.'}</li>
          <li>{currentLanguage === 'fr' ? 'Signer.' : 'Sign.'}</li>
          <li>{currentLanguage === 'fr' ? 'Générer les directives anticipées en format pdf.' : 'Generate the advance directives in PDF format.'}</li>
          <li>{currentLanguage === 'fr' ? 'Télécharger, Partager.' : 'Download, Share.'}</li>
        </ol>
        <p className="mt-3 text-sm italic">
          {currentLanguage === 'fr' 
            ? 'À la déconnexion, le document pdf est supprimé et non sauvegardé.' 
            : 'Upon disconnection, the PDF document is deleted and not saved.'}
        </p>
      </div>
      
      {/* Application image - improved presentation */}
      <div className="flex justify-center mb-8">
        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 w-full max-w-2xl">
          <img 
            src="/lovable-uploads/14a66bde-c25e-4428-8ad2-9549af103c9d.png" 
            alt={currentLanguage === 'fr' ? "Interface DirectivesPlus" : "DirectivesPlus Interface"} 
            className="w-full object-cover" 
            loading="lazy"
          />
        </div>
      </div>
      
      {/* Original content about the application */}
      <div className="text-center space-y-2 mb-8">
        <p className="text-base">
          {currentLanguage === 'fr' 
            ? 'Cette application a été imaginée par le :'
            : 'This application was designed by:'}
        </p>
        <p className="font-medium">
          {currentLanguage === 'fr'
            ? 'Dr F. Arezki, médecin anesthésiste-réanimateur, diplômé en éthique médicale et en douleur chronique, au CH Robert Pax de Sarreguemines.'
            : 'Dr F. Arezki, anesthesiologist-intensivist, qualified in medical ethics and chronic pain, at CH Robert Pax in Sarreguemines.'}
        </p>
        <p className="mt-4">
          {currentLanguage === 'fr' ? 'Contact :' : 'Contact:'}{' '}
          <a 
            href="mailto:mesdirectives@directivesplus.fr" 
            className="text-blue-600 hover:underline"
          >
            mesdirectives@directivesplus.fr
          </a>
        </p>
      </div>
      
      {/* Copyright footer */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
        <p>© {new Date().getFullYear()} DirectivesPlus. {currentLanguage === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
      </div>
    </div>
  );
}
