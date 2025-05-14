
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-white to-directiveplus-50 section-padding">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8 w-full flex justify-center">
            <img 
              src="/lovable-uploads/41199219-9056-4e5f-bae3-17439ecbb194.png" 
              alt="DirectivesPlus Logo" 
              className="w-64 h-auto"
            />
          </div>
          
          {/* Text Content */}
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Vos directives anticipées en toute simplicité
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Une solution complète pour gérer et suivre vos obligations réglementaires 
              en toute simplicité. Sécurisez vos données et améliorez votre conformité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-directiveplus-600 hover:bg-directiveplus-700 text-lg py-6 px-8">
                Commencer gratuitement
              </Button>
              <Button variant="outline" className="text-directiveplus-600 border-directiveplus-200 hover:bg-directiveplus-50 text-lg py-6 px-8">
                Demander une démo
              </Button>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              Aucune carte de crédit requise • Annulez à tout moment
            </div>
          </div>
          
          {/* Trusted By Section */}
          <div className="mt-20 text-center w-full">
            <p className="text-gray-500 mb-6">Utilisé par des organisations de confiance</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">LOGO</div>
              <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">LOGO</div>
              <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">LOGO</div>
              <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">LOGO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
