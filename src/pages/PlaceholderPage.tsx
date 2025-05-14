
import { useParams } from "react-router-dom";
import AppNavigation from "@/components/AppNavigation";

const PlaceholderPage = () => {
  const { pageId } = useParams();
  
  let title = "Page";
  let description = "Cette page est en construction.";
  
  switch (pageId) {
    case "avis-general":
      title = "Avis général";
      description = "Exprimez vos souhaits concernant vos soins médicaux généraux.";
      break;
    case "maintien-vie":
      title = "Maintien de la vie";
      description = "Précisez vos volontés concernant les traitements de maintien en vie.";
      break;
    case "maladie-avancee":
      title = "Maladie avancée";
      description = "Indiquez vos préférences en cas de maladie grave ou avancée.";
      break;
    case "gouts-peurs":
      title = "Mes goûts et mes peurs";
      description = "Partagez vos préférences personnelles et vos craintes.";
      break;
    case "personne-confiance":
      title = "Personne de confiance";
      description = "Désignez les personnes à consulter pour vos décisions médicales.";
      break;
    case "exemples-phrases":
      title = "Exemples de phrases";
      description = "Inspirez-vous d'exemples pour rédiger vos directives.";
      break;
    case "synthese":
      title = "Synthèse";
      description = "Visualisez et validez l'ensemble de vos directives anticipées.";
      break;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">{title}</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <p className="text-lg text-gray-700 mb-6">{description}</p>
            <div className="p-12 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-500">Cette page est en cours de développement.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default PlaceholderPage;
