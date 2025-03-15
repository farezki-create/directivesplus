
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResponsesSummary } from "@/components/ResponsesSummary";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const FreeText = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndLoadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.error("[FreeText] No user session found");
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour accéder à cette page",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        console.log("[FreeText] User session found:", session.user.id);
        setUserId(session.user.id);
      } catch (error) {
        console.error("[FreeText] Error checking auth:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de votre session",
          variant: "destructive",
        });
      }
    };

    checkAuthAndLoadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log("[FreeText] Auth state changed - user logged in:", session.user.id);
        setUserId(session.user.id);
      } else {
        console.log("[FreeText] Auth state changed - no user");
        setUserId(null);
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Synthèse de vos réponses</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <ResponsesSummary userId={userId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeText;
