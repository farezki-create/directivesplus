
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-gradient-to-b from-white to-directiveplus-50 section-padding">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center max-w-4xl mx-auto mb-8">
          <Logo className="mb-8 scale-150" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight text-center">
            Vos directives anticipées en toute simplicité
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">
            Rédigez vos directives anticipées et désignez vos personnes de confiance 
            en quelques étapes simples et sécurisées.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
            <Button 
              className="w-full md:w-2/3 py-6 text-lg bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/auth">Commencer</Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full md:w-2/3 py-6 text-lg border-directiveplus-200 text-directiveplus-600 hover:bg-directiveplus-50"
              asChild
            >
              <Link to="/en-savoir-plus">En savoir plus</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <Button 
              className="py-6 text-lg bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/questionnaire/avis-general">Avis général</Link>
            </Button>
            <Button 
              className="py-6 text-lg bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/questionnaire/maintien-vie">Maintien de la vie</Link>
            </Button>
            <Button 
              className="py-6 text-lg bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/questionnaire/maladie-avancee">Maladie avancée</Link>
            </Button>
            <Button 
              className="py-6 text-lg bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/questionnaire/gouts-peurs">Mes goûts et mes peurs</Link>
            </Button>
            <Button 
              className="py-6 text-lg bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/questionnaire/personne-confiance">Personne de confiance</Link>
            </Button>
            <Button 
              className="py-6 text-lg bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/exemples-phrases">Exemples de phrases à utiliser</Link>
            </Button>
            <Button 
              className="py-6 text-lg col-span-1 md:col-span-2 bg-purple-600 hover:bg-purple-700"
              asChild
            >
              <Link to="/synthese">Synthèse</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
