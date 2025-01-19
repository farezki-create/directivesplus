import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResponsesSummary } from "@/components/ResponsesSummary";

const FreeText = () => {
  const [userId, setUserId] = useState<string | null>(null);

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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Synthèse de vos réponses</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <ResponsesSummary userId={userId || ""} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeText;