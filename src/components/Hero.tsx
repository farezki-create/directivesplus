import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    // Rediriger vers la page de rédaction si l'utilisateur est authentifié
    if (isAuthenticated) {
      navigate("/rediger");
    } else {
      navigate("/auth");
    }
  };
  
  const scrollToInfo = () => {
    // Naviguer vers la page d'information sur les directives anticipées
    navigate("/directives-info");
  };
  
  return <section className="bg-gradient-to-b from-white to-directiveplus-50 section-padding">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8 w-full flex justify-center">
            <img src="/lovable-uploads/0a786ed1-a905-4b29-be3a-ca3b24d3efae.png" alt="DirectivesPlus Logo" className="w-64 h-auto" />
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
              <Button onClick={handleGetStarted} className="bg-directiveplus-600 hover:bg-directiveplus-700 text-lg py-6 px-8">
                Commencer
              </Button>
              <Button variant="outline" onClick={scrollToInfo} className="text-directiveplus-600 border-directiveplus-200 hover:bg-directiveplus-50 text-lg py-6 px-8">
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
              {/* Feature 1 - Simple et guidé with image */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col items-center mb-3">
                  <img src="/lovable-uploads/0a786ed1-a905-4b29-be3a-ca3b24d3efae.png" alt="Logo DirectivesPlus" className="w-20 h-20 mb-3 object-scale-down" />
                  <h3 className="font-semibold text-lg text-directiveplus-700">Simple et guidé</h3>
                </div>
                <p className="text-gray-600">Un processus pas à pas pour vous accompagner dans la rédaction.</p>
              </div>
              
              {/* Feature 2 - Modified with French flag */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col items-center mb-2">
                  <h3 className="font-semibold text-lg text-directiveplus-700">100% sécurisé en France</h3>
                  <div className="flex items-center mt-1">
                    <div className="h-6 w-12 flex overflow-hidden rounded shadow-sm">
                      <div className="bg-blue-700 w-1/3 h-full animate-pulse"></div>
                      <div className="bg-white w-1/3 h-full"></div>
                      <div className="bg-red-600 w-1/3 h-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Vos directives anticipées et données médicales sont stockées dans un serveur HDS Scalingo, 
                  certifié par les autorités de santé françaises. Scalingo est une entreprise française et les 
                  serveurs sont en France.
                </p>
              </div>
              
              {/* Feature 3 - Facilement partageable with image */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col items-center mb-3">
                  <img src="/lovable-uploads/0a786ed1-a905-4b29-be3a-ca3b24d3efae.png" alt="Logo DirectivesPlus" className="w-20 h-20 mb-3 object-cover" />
                  <h3 className="font-semibold text-lg text-directiveplus-700">Facilement partageable</h3>
                </div>
                <p className="text-gray-600">Télécharger, partager, imprimer: gérez vos directives comme vous le souhaitez.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;
