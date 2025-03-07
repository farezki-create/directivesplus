
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
  
  // Close all dialogs function
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
  
  // General Opinion handlers
  const handleGeneralOpinionClick = () => {
    console.log("[useHomeDialogs] General Opinion button clicked");
    closeAllDialogs();
    // Use setTimeout to ensure state updates have propagated
    setTimeout(() => {
      console.log("[useHomeDialogs] Opening general opinion explanation dialog");
      dialogState.setExplanationOpen(true);
    }, 100);
  };

  const handleExplanationContinue = () => {
    console.log("[useHomeDialogs] Continuing from explanation to questions");
    // Note: We don't need to close the explanation dialog here since
    // the ExplanationDialog component already does this
    
    setTimeout(() => {
      console.log("[useHomeDialogs] Opening questions dialog");
      dialogState.setQuestionsOpen(true);
    }, 600);
  };

  // Life Support handlers
  const handleLifeSupportClick = () => {
    console.log("[useHomeDialogs] Life Support button clicked");
    closeAllDialogs();
    setTimeout(() => {
      console.log("[useHomeDialogs] Opening life support explanation dialog");
      dialogState.setLifeSupportExplanationOpen(true);
    }, 100);
  };

  const handleLifeSupportExplanationContinue = () => {
    console.log("[useHomeDialogs] Continuing from life support explanation to questions");
    
    setTimeout(() => {
      console.log("[useHomeDialogs] Opening life support questions dialog");
      dialogState.setLifeSupportQuestionsOpen(true);
    }, 600);
  };

  // Advanced Illness handlers
  const handleAdvancedIllnessClick = () => {
    console.log("[useHomeDialogs] Advanced Illness button clicked");
    closeAllDialogs();
    setTimeout(() => {
      console.log("[useHomeDialogs] Opening advanced illness explanation dialog");
      dialogState.setAdvancedIllnessExplanationOpen(true);
    }, 100);
  };

  const handleAdvancedIllnessExplanationContinue = () => {
    console.log("[useHomeDialogs] Continuing from advanced illness explanation to questions");
    
    setTimeout(() => {
      console.log("[useHomeDialogs] Opening advanced illness questions dialog");
      dialogState.setAdvancedIllnessQuestionsOpen(true);
    }, 600);
  };

  // Preferences handlers
  const handlePreferencesClick = () => {
    console.log("[useHomeDialogs] Preferences button clicked");
    closeAllDialogs();
    setTimeout(() => {
      console.log("[useHomeDialogs] Opening preferences explanation dialog");
      dialogState.setPreferencesExplanationOpen(true);
    }, 100);
  };

  const handlePreferencesExplanationContinue = () => {
    console.log("[useHomeDialogs] Continuing from preferences explanation to questions");
    
    setTimeout(() => {
      console.log("[useHomeDialogs] Opening preferences questions dialog");
      dialogState.setPreferencesQuestionsOpen(true);
    }, 600);
  };
  
  // Cleanup effect
  useEffect(() => {
    console.log("[useHomeDialogs] Initializing dialog handlers");
    return () => {
      console.log("[useHomeDialogs] Cleaning up dialog handlers");
      closeAllDialogs();
    };
  }, []);
  
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
