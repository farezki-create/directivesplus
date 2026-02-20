
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import SecureDirectivesAccessForm from "@/components/access/SecureDirectivesAccessForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { getAuthUserDossier } from "@/api/accessCodeVerification";
import { useDirectivesStore } from "@/store/directivesStore";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const SecureDirectivesAccess = () => {
  const { user, isAuthenticated } = useAuth();
  const { setDocuments } = useDirectivesStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserDirectives = async () => {
      if (!isAuthenticated || !user?.id) return;
      
      try {
        const authResult = await getAuthUserDossier(user.id, "directive");
        
        if (authResult.success) {
          if (authResult.dossier?.contenu?.documents) {
            setDocuments(authResult.dossier.contenu.documents);
          }
          toast({
            title: "Accès autorisé",
            description: "Vos directives ont été chargées avec succès",
          });
          navigate("/directives-docs", { replace: true });
        } else {
          console.error("Failed to load user directives:", authResult.error);
        }
      } catch (error) {
        console.error("Error loading directives for authenticated user:", error);
      }
    };
    
    loadUserDirectives();
  }, [isAuthenticated, user, navigate, setDocuments]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated && (
          <Alert className="max-w-md mx-auto mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Vous êtes connecté en tant que {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}.
              Vos directives anticipées seront chargées automatiquement.
            </AlertDescription>
          </Alert>
        )}
        
        <SecureDirectivesAccessForm />
      </main>
    </div>
  );
};

export default SecureDirectivesAccess;
