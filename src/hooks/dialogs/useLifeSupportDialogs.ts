
import { useDialogState } from "@/hooks/useDialogState";
import { useToast } from "@/hooks/use-toast";

export function useLifeSupportDialogs(dialogState: ReturnType<typeof useDialogState>) {
  const { toast } = useToast();
  
  const handleLifeSupportClick = () => {
    try {
      dialogState.setLifeSupportExplanationOpen(true);
    } catch (error) {
      console.error("Error opening life support dialog:", error);
      toast({
        title: "Error",
        description: "An error occurred while opening the dialog.",
        variant: "destructive",
      });
    }
  };

  const handleLifeSupportExplanationContinue = () => {
    try {
      dialogState.setLifeSupportExplanationOpen(false);
      dialogState.setLifeSupportQuestionsOpen(true);
    } catch (error) {
      console.error("Error continuing from life support explanation:", error);
      toast({
        title: "Error",
        description: "An error occurred while proceeding to the next step.",
        variant: "destructive",
      });
    }
  };

  return {
    handleLifeSupportClick,
    handleLifeSupportExplanationContinue
  };
}
