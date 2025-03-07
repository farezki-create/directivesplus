
import { useDialogState } from "@/hooks/useDialogState";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

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
  
  useEffect(() => {
    console.log("[useHomeDialogs] Initializing dialog handlers");
    return () => {
      console.log("[useHomeDialogs] Cleaning up dialog handlers");
      dialogState.setExplanationOpen(false);
      dialogState.setQuestionsOpen(false);
      dialogState.setLifeSupportExplanationOpen(false);
      dialogState.setLifeSupportQuestionsOpen(false);
      dialogState.setAdvancedIllnessExplanationOpen(false);
      dialogState.setAdvancedIllnessQuestionsOpen(false);
      dialogState.setPreferencesExplanationOpen(false);
      dialogState.setPreferencesQuestionsOpen(false);
    };
  }, []);
  
  // Close all other dialogs before opening a new one
  const closeAllDialogs = () => {
    console.log("[useHomeDialogs] Closing all dialogs");
    dialogState.setExplanationOpen(false);
    dialogState.setQuestionsOpen(false);
    dialogState.setLifeSupportExplanationOpen(false);
    dialogState.setLifeSupportQuestionsOpen(false);
    dialogState.setAdvancedIllnessExplanationOpen(false);
    dialogState.setAdvancedIllnessQuestionsOpen(false);
    dialogState.setPreferencesExplanationOpen(false);
    dialogState.setPreferencesQuestionsOpen(false);
  };
  
  const handleGeneralOpinionClick = () => {
    try {
      console.log("[useHomeDialogs] Opening general opinion explanation dialog");
      closeAllDialogs();
      
      // Use a small timeout to ensure state updates have propagated
      setTimeout(() => {
        dialogState.setExplanationOpen(true);
      }, 100);
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
      
      // Increase timeout to ensure explanation dialog is fully closed
      setTimeout(() => {
        console.log("[useHomeDialogs] Opening questions dialog after delay");
        dialogState.setQuestionsOpen(true);
      }, 500);
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
      closeAllDialogs();
      setTimeout(() => {
        dialogState.setLifeSupportExplanationOpen(true);
      }, 100);
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
      
      setTimeout(() => {
        dialogState.setLifeSupportQuestionsOpen(true);
      }, 500);
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
      closeAllDialogs();
      setTimeout(() => {
        dialogState.setAdvancedIllnessExplanationOpen(true);
      }, 100);
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
      
      setTimeout(() => {
        dialogState.setAdvancedIllnessQuestionsOpen(true);
      }, 500);
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
      closeAllDialogs();
      setTimeout(() => {
        dialogState.setPreferencesExplanationOpen(true);
      }, 100);
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
      
      setTimeout(() => {
        dialogState.setPreferencesQuestionsOpen(true);
      }, 500);
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
