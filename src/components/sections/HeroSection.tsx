
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        {/* Logo au-dessus du titre */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/70 rounded-xl p-12 shadow-sm">
            <img 
              src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
              alt="DirectivesPlus" 
              className="h-80 w-auto"
            />
          </div>
        </div>
        
        <h3 className="text-5xl font-bold text-gray-900 mb-6">
          Vos volontés, <span className="text-directiveplus-600">protégées</span> et accessibles
        </h3>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Créez, stockez et partagez vos directives anticipées en toute sécurité. 
          Assurez-vous que vos souhaits soient respectés, même quand vous ne pouvez plus les exprimer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated ? (
            <>
              <Link to="/auth">
                <Button size="lg" className="bg-directiveplus-600 hover:bg-directiveplus-700">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/en-savoir-plus">
                <Button size="lg" variant="outline" className="border-directiveplus-600 text-directiveplus-600 hover:bg-directiveplus-50">
                  En savoir plus
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/rediger">
              <Button size="lg" className="bg-directiveplus-600 hover:bg-directiveplus-700">
                Accéder à mes directives
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
