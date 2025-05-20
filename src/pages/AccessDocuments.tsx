
import { useEffect } from "react";
import AccessDocumentForm from "@/components/access/AccessDocumentForm";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AccessDocuments = () => {
  const { isAuthenticated } = useAuth();
  
  // Effet pour afficher un message d'information au chargement de la page
  useEffect(() => {
    console.log("Page d'accès aux documents chargée");
    console.log("État d'authentification:", isAuthenticated ? "Connecté" : "Non connecté");
    
    toast({
      title: "Accès aux documents",
      description: "Veuillez saisir vos informations et le code d'accès"
    });
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <AccessDocumentForm />
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccessDocuments;
