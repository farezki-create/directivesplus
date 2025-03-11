
import { useLanguage } from "@/hooks/useLanguage";

export function AppInfoSection() {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {currentLanguage === 'fr' ? 'À propos de DirectivesPlus' : 'About DirectivesPlus'}
      </h2>
      
      <div className="text-center space-y-2">
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
    </div>
  );
}
