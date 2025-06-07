
import React from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Directives = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
            Directives Anticipées
          </h1>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Directive #{id}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Informations générales</h3>
                <p className="text-gray-600">
                  Cette page affiche les détails d'une directive anticipée spécifique.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Contenu de la directive</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Le contenu de la directive sera affiché ici selon l'ID fourni dans l'URL.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button>
                  Modifier
                </Button>
                <Button variant="outline">
                  Partager
                </Button>
                <Button variant="outline">
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Directives;
