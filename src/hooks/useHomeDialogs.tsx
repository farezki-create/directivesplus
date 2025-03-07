import { useDialogState } from "@/hooks/useDialogState";
import { useToast } from "@/hooks/use-toast";

interface DialogHandlers {
  handleGeneralOpinionClick: () => void;
  handleExplanationContinue: () => void;
  handleLifeSupportClick: () => void;
  handleLifeSupportExplanationContinue: () => void;
  handleAdvancedIllnessClick: () => void;
  handleAdvancedIllnessExplanationContinue: () => void;
  handlePreferencesClick: () => void;
  handlePreferencesExplanationContinue: () => void;
}

interface UseHomeDialogsReturn {
  dialogState: ReturnType<typeof useDialogState>;
  handlers: DialogHandlers;
}

export function useHomeDialogs(): UseHomeDialogsReturn {
  const dialogState = useDialogState();
  const { toast } = useToast();
  
  const handleGeneralOpinionClick = () => {
    try {
      console.log("[HomeDialogs] Opening general opinion explanation dialog");
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
    try {
      console.log("[HomeDialogs] Moving from explanation to questions dialog");
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
    dialogState,
    handlers: {
      handleGeneralOpinionClick,
      handleExplanationContinue,
      handleLifeSupportClick,
      handleLifeSupportExplanationContinue,
      handleAdvancedIllnessClick,
      handleAdvancedIllnessExplanationContinue,
      handlePreferencesClick,
      handlePreferencesExplanationContinue
    }
  };
}
