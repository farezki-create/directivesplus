
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-directiveplus-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Prêt à protéger vos volontés ?
        </h3>
        <p className="text-xl mb-8 opacity-90">
          Rejoignez les milliers de personnes qui ont déjà sécurisé leurs directives anticipées.
        </p>
        {!isAuthenticated ? (
          <Link to="/auth">
            <Button size="lg" className="bg-white text-directiveplus-600 hover:bg-gray-100">
              Commencer maintenant
            </Button>
          </Link>
        ) : (
          <Link to="/rediger">
            <Button size="lg" className="bg-white text-directiveplus-600 hover:bg-gray-100">
              Accéder à mes directives
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default CTASection;
