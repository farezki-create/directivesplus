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
  
  const handleGeneralOpinionClick = () => {
    try {
      console.log("[useHomeDialogs] Opening general opinion explanation dialog");
      dialogState.setQuestionsOpen(false);
      dialogState.setLifeSupportExplanationOpen(false);
      dialogState.setLifeSupportQuestionsOpen(false);
      dialogState.setAdvancedIllnessExplanationOpen(false);
      dialogState.setAdvancedIllnessQuestionsOpen(false);
      dialogState.setPreferencesExplanationOpen(false);
      dialogState.setPreferencesQuestionsOpen(false);
      
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
      
      setTimeout(() => {
        dialogState.setLifeSupportQuestionsOpen(true);
      }, 300);
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
      
      setTimeout(() => {
        dialogState.setAdvancedIllnessQuestionsOpen(true);
      }, 300);
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
      
      setTimeout(() => {
        dialogState.setPreferencesQuestionsOpen(true);
      }, 300);
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
