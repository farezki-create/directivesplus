import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ResponsesSummary } from "@/components/ResponsesSummary";

const Examples = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { responses, isLoading: isLoadingResponses, hasErrors } = useQuestionnairesResponses(userId || "");

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log("[Examples] Fetching user session");
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("[Examples] User found:", session.user.id);
          setUserId(session.user.id);
        } else {
          console.log("[Examples] No user session found");
        }
      } catch (error) {
        console.error("[Examples] Error fetching user session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const renderResponses = () => {
    if (isLoading || isLoadingResponses) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!userId) {
      return (
        <Alert>
          <AlertDescription>
            Veuillez vous connecter pour voir vos réponses.
          </AlertDescription>
        </Alert>
      );
    }

    if (hasErrors) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Une erreur est survenue lors du chargement de vos réponses.
          </AlertDescription>
        </Alert>
      );
    }

    return <ResponsesSummary userId={userId} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Documents
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button 
              onClick={() => navigate("/dashboard?tab=persons")}
              size="lg"
              className="w-full"
            >
              Personne de confiance
            </Button>
            <Button 
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="w-full"
            >
              Directives anticipées
            </Button>
          </div>
          
          {userId && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Mes directives anticipées</h2>
              {renderResponses()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Examples;