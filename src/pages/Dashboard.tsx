
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ResponsesSummary } from "@/components/ResponsesSummary";
import { AllQuestionnaires } from "@/components/AllQuestionnaires";

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndLoadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.error("[Dashboard] No user session found");
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour accéder à cette page",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        console.log("[Dashboard] User session found:", session.user.id);
        setUserId(session.user.id);
      } catch (error) {
        console.error("[Dashboard] Error checking auth:", error);
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
        console.log("[Dashboard] Auth state changed - user logged in:", session.user.id);
        setUserId(session.user.id);
      } else {
        console.log("[Dashboard] Auth state changed - no user");
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
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <AllQuestionnaires />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <ResponsesSummary userId={userId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
