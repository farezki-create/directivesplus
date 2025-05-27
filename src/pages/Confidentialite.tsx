
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Confidentialite = () => {
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
            Politique de confidentialité
          </h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Protection de vos données</h2>
            <p className="mb-6">
              Nous prenons très au sérieux la protection de vos données personnelles et médicales.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Hébergement sécurisé</h2>
            <p className="mb-6">
              Nos serveurs sont conformes aux normes HDS (Hébergement des Données de Santé) et utilisent 
              un chiffrement de bout en bout.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Vos droits</h2>
            <p className="mb-6">
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <p>
              Pour exercer vos droits ou pour toute question :
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

export default Confidentialite;
