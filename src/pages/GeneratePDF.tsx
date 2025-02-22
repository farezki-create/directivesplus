
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useDirectives } from "@/hooks/useDirectives";
import { FileText, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseSection } from "@/components/responses/ResponseSection";
import { Card } from "@/components/ui/card";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { responses, isLoading: responsesLoading } = useQuestionnairesResponses(userId || "");
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();
  const { directive, isLoading: directiveLoading, saveDirective } = useDirectives(userId || "");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (userId && responses && profile && !responsesLoading && !profileLoading) {
      console.log("[GeneratePDF] Saving directives");
      saveDirective.mutate({
        general: responses.general,
        lifeSupport: responses.lifeSupport,
        advancedIllness: responses.advancedIllness,
        preferences: responses.preferences,
        profile,
        trustedPersons,
      });
    }
  }, [userId, responses, profile, responsesLoading, profileLoading]);

  if (!userId) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Génération de mes directives anticipées</h2>
          <button 
            onClick={() => navigate("/free-text")}
            className="text-blue-500 hover:text-blue-700"
          >
            Retour à la saisie
          </button>
        </div>

        <div className="flex gap-4 flex-wrap">
          {!loading && (
            <>
              <PDFGenerator userId={userId} onPdfGenerated={setPdfUrl} />
              <PDFGenerator userId={userId} isCardFormat={true} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
