
import { useEffect } from "react";
import DirectivesAccessForm from "@/components/access/DirectivesAccessForm";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/ui/back-button";

const DirectivesAccess = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log("Page d'accès aux directives chargée");
    console.log("État d'authentification:", isAuthenticated ? "Connecté" : "Non connecté");
    
    toast({
      title: "Accès aux directives anticipées",
      description: "Veuillez saisir vos informations et le code d'accès"
    });
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-6">
        <BackButton />
        <DirectivesAccessForm />
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default DirectivesAccess;
