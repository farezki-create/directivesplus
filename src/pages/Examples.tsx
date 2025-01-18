import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSynthesis } from "@/hooks/useSynthesis";

const Examples = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { text: synthesisText } = useSynthesis(userId);
  const [isLoading, setIsLoading] = useState(true);

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

  const renderSynthesis = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    if (!userId) {
      return (
        <Alert>
          <AlertDescription>
            Veuillez vous connecter pour voir votre synthèse.
          </AlertDescription>
        </Alert>
      );
    }

    if (!synthesisText) {
      return (
        <Alert>
          <AlertDescription>
            Aucune synthèse n'a été rédigée pour le moment.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div className="whitespace-pre-wrap">{synthesisText}</div>
      </ScrollArea>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Documents
        </h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="p-8 h-auto flex flex-col gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <span className="text-lg font-semibold">Personne de confiance</span>
              <span className="text-sm text-gray-500">
                Désignation de la personne de confiance
              </span>
            </Button>

            <Button 
              variant="outline" 
              className="p-8 h-auto flex flex-col gap-2"
              onClick={() => navigate("/free-text")}
            >
              <span className="text-lg font-semibold">Directives anticipées</span>
              <span className="text-sm text-gray-500">
                Rédaction des directives anticipées
              </span>
            </Button>
          </div>

          {userId && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Mes directives anticipées</h2>
              {renderSynthesis()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Examples;