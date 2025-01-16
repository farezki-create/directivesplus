import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const FreeText = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { responses } = useQuestionnairesResponses(userId);

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
      // Créer un objet contenant toutes les réponses
      const exportData = {
        "Avis général": responses.general?.map(response => ({
          question: response.questions.Question,
          réponse: response.response
        })),
        "Maintien en vie": responses.lifeSupport?.map(response => ({
          question: response.life_support_questions.question,
          réponse: response.response
        })),
        "Maladie avancée": responses.advancedIllness?.map(response => ({
          question: response.advanced_illness_questions.question,
          réponse: response.response
        })),
        "Mes goûts et mes peurs": responses.preferences?.map(response => ({
          question: response.preferences_questions.question,
          réponse: response.response
        })),
        "Synthèse": responses.synthesis?.free_text
      };

      // Convertir en JSON et créer un blob
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "synthese-directives.json";
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast({
        title: "Export réussi",
        description: "Vos réponses ont été exportées avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur lors de l'export",
        description: "Une erreur est survenue lors de l'export de vos réponses.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
          
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Synthèse de vos réponses</h2>
            <p className="text-muted-foreground">
              La synthèse de vos réponses aux différentes sections du questionnaire apparaîtra ici.
            </p>
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
            <Button
              onClick={() => {
                // TODO: Save the text
                navigate("/");
              }}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeText;