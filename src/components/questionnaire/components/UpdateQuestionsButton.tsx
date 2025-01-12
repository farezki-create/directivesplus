import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

interface UpdateQuestionsButtonProps {
  onUpdate: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
  variant?: "default" | "outline";
}

export const UpdateQuestionsButton = ({ 
  onUpdate, 
  variant = "outline" 
}: UpdateQuestionsButtonProps) => {
  const { toast } = useToast();

  const handleUpdateQuestions = async () => {
    try {
      console.log('Calling read-csv-questions function...');
      const { data, error } = await supabase.functions.invoke('read-csv-questions');
      
      if (error) {
        console.error('Error from read-csv-questions:', error);
        throw error;
      }

      console.log('Response from read-csv-questions:', data);
      
      if (data.count === 0) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Aucune question n'a été trouvée dans le fichier CSV.",
        });
        return;
      }
      
      await onUpdate();
      
      toast({
        title: "Succès",
        description: `${data.count} questions ont été mises à jour avec succès.`,
      });
    } catch (error) {
      console.error("Error updating questions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des questions.",
      });
    }
  };

  return (
    <Button 
      onClick={handleUpdateQuestions}
      variant={variant}
      className="flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Mettre à jour les questions
    </Button>
  );
};