
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MoreInfo = () => {
  const navigate = useNavigate();
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    // Vérifier si le PDF est accessible
    const checkPdfExists = async () => {
      try {
        const response = await fetch('/assets/documents/directives_anticipees.pdf');
        if (!response.ok) {
          setPdfError(true);
          console.error("PDF not found:", response.status);
        }
      } catch (error) {
        setPdfError(true);
        console.error("Error checking PDF:", error);
      }
    };
    
    checkPdfExists();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          
          <h1 className="text-3xl font-bold mb-6">
            Les directives anticipées
          </h1>
          
          {pdfError ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-amber-400 mb-4" />
              <h3 className="text-lg font-medium text-amber-800 mb-2">Document non disponible</h3>
              <p className="text-amber-700">
                Le document PDF des directives anticipées n'est pas disponible pour le moment.
              </p>
              <Button 
                variant="outline"
                className="mt-4"
                onClick={() => navigate(-1)}
              >
                Retourner à l'accueil
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden shadow-md">
              <iframe 
                src="/assets/documents/directives_anticipees.pdf" 
                className="w-full h-[800px]"
                title="Directives anticipées"
                onError={() => setPdfError(true)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MoreInfo;
