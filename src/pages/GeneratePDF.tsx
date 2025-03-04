
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useDirectives } from "@/hooks/useDirectives";
import { FileText, UserCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseSection } from "@/components/responses/ResponseSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { responses, isLoading: responsesLoading } = useQuestionnairesResponses(userId || "");
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();
  const { directive, isLoading: directiveLoading, saveDirective } = useDirectives(userId || "");

  // Combine all loading states
  const isLoading = responsesLoading || profileLoading || directiveLoading;

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

  const handleSaveDirectives = () => {
    if (!userId || !responses || !profile || responsesLoading || profileLoading) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos directives. Données manquantes.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log("[GeneratePDF] Manually saving directives");
      saveDirective.mutate(
        {
          general: responses.general,
          lifeSupport: responses.lifeSupport,
          advancedIllness: responses.advancedIllness,
          preferences: responses.preferences,
          profile,
          trustedPersons,
        },
        {
          onSettled: () => {
            setIsSaving(false);
          }
        }
      );
    } catch (error) {
      console.error("[GeneratePDF] Error saving directives:", error);
      setIsSaving(false);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('generateAdvanceDirectives')}</h2>
          <button 
            onClick={() => navigate("/free-text")}
            className="text-blue-500 hover:text-blue-700"
          >
            {t('backToInput')}
          </button>
        </div>

        <Card className="p-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{t('saveYourDirectives')}</h3>
            <Button 
              onClick={handleSaveDirectives}
              disabled={isLoading || isSaving}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? t('saving') : t('saveDirectives')}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {t('directivesSavedSecurely')}
          </p>
        </Card>

        <div className="flex gap-4 flex-wrap">
          {!isLoading && (
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
