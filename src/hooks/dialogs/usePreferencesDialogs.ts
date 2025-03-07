
import { useDialogState } from "@/hooks/useDialogState";
import { useToast } from "@/hooks/use-toast";

export function usePreferencesDialogs(dialogState: ReturnType<typeof useDialogState>) {
  const { toast } = useToast();
  
  const handlePreferencesClick = () => {
    try {
      dialogState.setPreferencesExplanationOpen(true);
    } catch (error) {
      console.error("Error opening preferences dialog:", error);
      toast({
        title: "Error",
        description: "An error occurred while opening the dialog.",
        variant: "destructive",
      });
    }
  };

  const handlePreferencesExplanationContinue = () => {
    try {
      dialogState.setPreferencesExplanationOpen(false);
      dialogState.setPreferencesQuestionsOpen(true);
    } catch (error) {
      console.error("Error continuing from preferences explanation:", error);
      toast({
        title: "Error",
        description: "An error occurred while proceeding to the next step.",
        variant: "destructive",
      });
    }
  };

  return {
    handlePreferencesClick,
    handlePreferencesExplanationContinue
  };
}
