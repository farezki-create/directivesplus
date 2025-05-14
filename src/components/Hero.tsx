
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-white to-directiveplus-50 section-padding">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side - Text Content */}
          <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Simplifiez vos <span className="text-directiveplus-600">directives sanitaires</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Une solution complète pour gérer et suivre vos obligations réglementaires 
              en toute simplicité. Sécurisez vos données et améliorez votre conformité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
          
          {/* Right Side - Image */}
          <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-lg shadow-xl p-4 transform hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-directiveplus-100 rounded overflow-hidden flex items-center justify-center">
                <div className="text-directiveplus-500 flex flex-col items-center justify-center p-8">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-center font-medium">Aperçu de l'application</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trusted By Section */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-6">Utilisé par des organisations de confiance</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">LOGO</div>
            <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">LOGO</div>
            <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">LOGO</div>
            <div className="h-12 flex items-center justify-center text-gray-400 font-bold text-xl">LOGO</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
