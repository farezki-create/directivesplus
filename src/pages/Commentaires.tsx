
import { useEffect } from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Commentaires = () => {
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
            Commentaires
          </h1>
          
          <div className="prose max-w-none">
            <p className="mb-6">
              Votre avis nous intéresse ! Partagez vos commentaires et suggestions pour améliorer DirectivesPlus.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Nous contacter</h2>
              <p>
                Pour toute suggestion ou commentaire, n'hésitez pas à nous écrire à :
                <a href="mailto:mesdirectives@directivesplus.fr" className="text-directiveplus-600 hover:underline ml-1">
                  mesdirectives@directivesplus.fr
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Commentaires;
