
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateGeneralOpinionQuestions } from "@/utils/updateGeneralOpinionQuestions";
import { useToast } from "@/hooks/use-toast";

export function UpdateQuestionsButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateQuestions = async () => {
    try {
      setLoading(true);
      await updateGeneralOpinionQuestions();
      toast({
        title: "Succès",
        description: "Les questions d'avis général ont été mises à jour.",
      });
    } catch (error) {
      console.error("Error updating questions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les questions. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleUpdateQuestions} 
      disabled={loading}
      variant="outline"
      className="ml-2"
    >
      {loading ? (
        <span className="flex items-center">
          <span className="mr-2 animate-spin">⟳</span>
          Mise à jour...
        </span>
      ) : "Mettre à jour les questions"}
    </Button>
  );
}
