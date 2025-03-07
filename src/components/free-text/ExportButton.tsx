import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";

interface ExportButtonProps {
  userId: string | null;
}

export function ExportButton({ userId }: ExportButtonProps) {
  const { toast } = useToast();
  const { responses } = useQuestionnairesResponses(userId || "");

  const handleExport = () => {
    try {
      console.log("[ExportButton] Starting export of responses");
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

      console.log("[ExportButton] Prepared export data:", exportData);

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "directives-anticipees.json";
      
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      console.log("[ExportButton] Export completed successfully");
      toast({
        title: "Export réussi",
        description: "Vos réponses ont été exportées avec succès.",
      });
    } catch (error) {
      console.error("[ExportButton] Error during export:", error);
      toast({
        title: "Erreur lors de l'export",
        description: "Une erreur est survenue lors de l'export de vos réponses.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Exporter
    </Button>
  );
}