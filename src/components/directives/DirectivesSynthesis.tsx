import { ResponsesSummary } from "@/components/ResponsesSummary";
import { PDFGenerator } from "@/components/PDFGenerator";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function DirectivesSynthesis() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log("[DirectivesSynthesis] Initializing component");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[DirectivesSynthesis] Got session, user ID:", session?.user?.id);
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!userId) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Synthèse de mes directives anticipées</h2>
        <ResponsesSummary userId={userId} />
      </Card>

      <PDFGenerator />
    </div>
  );
}