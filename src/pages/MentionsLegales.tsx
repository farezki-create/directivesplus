
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MentionsLegales = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-directiveplus-800">
            Mentions légales & CGU
          </h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Informations légales</h2>
            <p className="mb-6">
              DirectivesPlus est un service permettant la création et la gestion de directives anticipées médicales.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Conditions générales d'utilisation</h2>
            <p className="mb-6">
              En utilisant notre service, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <p>
              Pour toute question concernant ces mentions légales :
              <a href="mailto:mesdirectives@directivesplus.fr" className="text-directiveplus-600 hover:underline ml-1">
                mesdirectives@directivesplus.fr
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default MentionsLegales;
