import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResponsesSummary } from "@/components/ResponsesSummary";
import { ExportButton } from "@/components/free-text/ExportButton";
import { FreeTextInput } from "@/components/free-text/FreeTextInput";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FreeText = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Synthèse et expression libre</h1>
            <ExportButton userId={userId} />
          </div>

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
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Synthèse de vos réponses</h2>
            <div className="bg-white rounded-lg shadow">
              <ResponsesSummary userId={userId || ""} />
            </div>
          </div>

          <FreeTextInput userId={userId} />
        </div>
      </main>
    </div>
  );
};

export default FreeText;