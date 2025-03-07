
import { useDialogState } from "@/hooks/useDialogState";
import { useToast } from "@/hooks/use-toast";

export function useAdvancedIllnessDialogs(dialogState: ReturnType<typeof useDialogState>) {
  const { toast } = useToast();
  
  const handleAdvancedIllnessClick = () => {
    try {
      dialogState.setAdvancedIllnessExplanationOpen(true);
    } catch (error) {
      console.error("Error opening advanced illness dialog:", error);
      toast({
        title: "Error",
        description: "An error occurred while opening the dialog.",
        variant: "destructive",
      });
    }
  };

  const handleAdvancedIllnessExplanationContinue = () => {
    try {
      dialogState.setAdvancedIllnessExplanationOpen(false);
      dialogState.setAdvancedIllnessQuestionsOpen(true);
    } catch (error) {
      console.error("Error continuing from advanced illness explanation:", error);
      toast({
        title: "Error",
        description: "An error occurred while proceeding to the next step.",
        variant: "destructive",
      });
    }
  };

  return {
    handleAdvancedIllnessClick,
    handleAdvancedIllnessExplanationContinue
  };
}
