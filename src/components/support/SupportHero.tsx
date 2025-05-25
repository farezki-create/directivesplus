
import { Heart, Users, Building2 } from "lucide-react";

const SupportHero = () => {
  return (
    <section className="bg-gradient-to-b from-directiveplus-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-directiveplus-800 mb-6">
            Soutenez DirectivePlus
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Aidez-nous à développer une plateforme accessible à tous pour les directives anticipées. 
            Votre soutien fait la différence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Heart className="h-12 w-12 text-directiveplus-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-directiveplus-700 mb-2">
              Mission sociale
            </h3>
            <p className="text-gray-600">
              Faciliter l'accès aux directives anticipées pour tous
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="h-12 w-12 text-directiveplus-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-directiveplus-700 mb-2">
              Communauté
            </h3>
            <p className="text-gray-600">
              Construire ensemble un outil utile à la société
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Building2 className="h-12 w-12 text-directiveplus-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-directiveplus-700 mb-2">
              Impact durable
            </h3>
            <p className="text-gray-600">
              Créer un service pérenne et de qualité
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportHero;
