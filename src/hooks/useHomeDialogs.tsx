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
      console.log("[useHomeDialogs] Opening general opinion explanation dialog");
      // Close any other dialogs that might be open
      dialogState.setQuestionsOpen(false);
      dialogState.setLifeSupportExplanationOpen(false);
      dialogState.setLifeSupportQuestionsOpen(false);
      dialogState.setAdvancedIllnessExplanationOpen(false);
      dialogState.setAdvancedIllnessQuestionsOpen(false);
      dialogState.setPreferencesExplanationOpen(false);
      dialogState.setPreferencesQuestionsOpen(false);
      
      // Open the explanation dialog
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
      console.log("[useHomeDialogs] Moving from explanation to questions dialog");
      dialogState.setExplanationOpen(false);
      // Ensure we set questions open to true
      setTimeout(() => {
        dialogState.setQuestionsOpen(true);
      }, 100);
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
