
import { useDialogState } from "@/hooks/useDialogState";
import { useToast } from "@/hooks/use-toast";

export function useGeneralOpinionDialogs(dialogState: ReturnType<typeof useDialogState>) {
  const { toast } = useToast();
  
  const handleGeneralOpinionClick = () => {
    console.log("[HomeDialogs] General Opinion clicked");
    try {
      dialogState.setExplanationOpen(true);
    } catch (error) {
      console.error("Error opening general opinion dialog:", error);
      toast({
        title: "Error",
        description: "An error occurred while opening the dialog.",
        variant: "destructive",
      });
    }
  };

  const handleExplanationContinue = () => {
    console.log("[HomeDialogs] Explanation continue clicked");
    try {
      dialogState.setExplanationOpen(false);
      dialogState.setQuestionsOpen(true);
    } catch (error) {
      console.error("Error continuing from explanation:", error);
      toast({
        title: "Error",
        description: "An error occurred while proceeding to the next step.",
        variant: "destructive",
      });
    }
  };

  return {
    handleGeneralOpinionClick,
    handleExplanationContinue
  };
}
