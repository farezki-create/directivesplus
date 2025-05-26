
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DirectivesGrid from "@/components/DirectivesGrid";
import InfoSteps from "@/components/InfoSteps";
import MedicalDocumentSection from "@/components/synthesis/MedicalDocumentSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Rediger = () => {
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  const handleMedicalDocumentUpload = () => {
    console.log("Document médical ajouté dans la page rédiger");
  };

  const handleDocumentAdd = (documentInfo: any) => {
    console.log("Document ajouté:", documentInfo);
  };

  const handleDocumentRemove = (documentId: string) => {
    console.log("Document retiré:", documentId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
            Vos directives anticipées en toute simplicité
          </h1>
          <p className="text-gray-600 text-lg">
            Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.
          </p>
        </div>
        
        <InfoSteps />
        
        {/* Section des documents médicaux */}
        <div className="max-w-4xl mx-auto mb-8">
          <MedicalDocumentSection 
            userId={user?.id}
            onUploadComplete={handleMedicalDocumentUpload}
            onDocumentAdd={handleDocumentAdd}
            onDocumentRemove={handleDocumentRemove}
          />
        </div>
        
        <DirectivesGrid />
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Rediger;
