
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };
  
  const scrollToInfo = () => {
    const infoSection = document.getElementById('en-savoir-plus');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-directiveplus-50 section-padding">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8 w-full flex justify-center">
            <img 
              src="/lovable-uploads/0a786ed1-a905-4b29-be3a-ca3b24d3efae.png" 
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
              <Button 
                onClick={handleGetStarted}
                className="bg-directiveplus-600 hover:bg-directiveplus-700 text-lg py-6 px-8"
              >
                Commencer
              </Button>
              <Button 
                variant="outline" 
                onClick={scrollToInfo}
                className="text-directiveplus-600 border-directiveplus-200 hover:bg-directiveplus-50 text-lg py-6 px-8"
              >
                En savoir plus
              </Button>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              Inscription • Aucune carte de crédit requise
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-directiveplus-700">Simple et guidé</h3>
                <p className="text-gray-600">Un processus pas à pas pour vous accompagner dans la rédaction.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-directiveplus-700">100% sécurisé</h3>
                <p className="text-gray-600">Vos directives anticipées ne sont jamais stockées et sont automatiquement supprimées dès que vous vous déconnectez.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2 text-directiveplus-700">Facilement partageable</h3>
                <p className="text-gray-600">Télécharger, partager, imprimer: gérez vos directives comme vous le souhaitez.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
