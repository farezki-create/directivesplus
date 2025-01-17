import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ResponsesSummary } from "@/components/ResponsesSummary";

const FreeText = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { responses, isLoading } = useQuestionnairesResponses(userId);

  useEffect(() => {
    // Get the current user's ID when the component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleExport = () => {
    try {
      console.log("[FreeText] Starting export of responses");
      // Créer un objet contenant toutes les réponses
      const exportData = {
        "Avis général": responses.general?.map(response => ({
          question: response.question_text || response.questions?.Question,
          réponse: response.response
        })),
        "Maintien en vie": responses.lifeSupport?.map(response => ({
          question: response.question_text || response.life_support_questions?.question,
          réponse: response.response
        })),
        "Maladie avancée": responses.advancedIllness?.map(response => ({
          question: response.question_text || response.advanced_illness_questions?.question,
          réponse: response.response
        })),
        "Mes goûts et mes peurs": responses.preferences?.map(response => ({
          question: response.question_text || response.preferences_questions?.question,
          réponse: response.response
        })),
        "Synthèse": responses.synthesis?.free_text
      };

      console.log("[FreeText] Prepared export data:", exportData);

      // Convertir en JSON et créer un blob
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "directives-anticipees.json";
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      console.log("[FreeText] Export completed successfully");
      toast({
        title: "Export réussi",
        description: "Vos réponses ont été exportées avec succès.",
      });
    } catch (error) {
      console.error("[FreeText] Error during export:", error);
      toast({
        title: "Erreur lors de l'export",
        description: "Une erreur est survenue lors de l'export de vos réponses.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!userId) {
      console.log("[FreeText] No user ID found, cannot save");
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("[FreeText] Saving synthesis text");
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: userId,
          free_text: text
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("[FreeText] Error saving synthesis:", error);
        throw error;
      }

      console.log("[FreeText] Synthesis saved successfully");
      toast({
        title: "Succès",
        description: "Votre synthèse a été enregistrée.",
      });
      navigate("/");
    } catch (error) {
      console.error("[FreeText] Error during save:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Load existing synthesis text when userId changes
    const loadSynthesis = async () => {
      if (!userId) return;

      try {
        console.log("[FreeText] Loading existing synthesis");
        const { data, error } = await supabase
          .from('questionnaire_synthesis')
          .select('free_text')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error("[FreeText] Error loading synthesis:", error);
          throw error;
        }

        if (data?.free_text) {
          console.log("[FreeText] Loaded existing synthesis");
          setText(data.free_text);
        }
      } catch (error) {
        console.error("[FreeText] Error loading synthesis:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre synthèse existante.",
          variant: "destructive",
        });
      }
    };

    loadSynthesis();
  }, [userId, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Synthèse et expression libre</h1>
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Synthèse de vos réponses</h2>
            <div className="bg-white rounded-lg shadow">
              <ResponsesSummary userId={userId || ""} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Expression libre</h2>
            <p className="text-muted-foreground mb-4">
              Utilisez cet espace pour exprimer librement vos souhaits, vos valeurs ou toute autre information que vous souhaitez partager avec l'équipe soignante.
            </p>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrivez ici..."
              className="min-h-[200px] mb-6"
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              Retour
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeText;