
import { useDialogState } from "@/hooks/useDialogState";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useCallback } from "react";
import { closeAllDialogs } from "./dialogs/useDialogUtils";
import { useGeneralOpinionHandlers } from "./dialogs/useGeneralOpinionHandlers";
import { useLifeSupportHandlers } from "./dialogs/useLifeSupportHandlers";
import { useAdvancedIllnessHandlers } from "./dialogs/useAdvancedIllnessHandlers";
import { usePreferencesHandlers } from "./dialogs/usePreferencesHandlers";
import { UseHomeDialogsReturn } from "./dialogs/types";

export function useHomeDialogs(): UseHomeDialogsReturn {
  const dialogState = useDialogState();
  const { toast } = useToast();
  
  // Import all the individual dialog handlers
  const generalOpinionHandlers = useGeneralOpinionHandlers(dialogState);
  const lifeSupportHandlers = useLifeSupportHandlers(dialogState);
  const advancedIllnessHandlers = useAdvancedIllnessHandlers(dialogState);
  const preferencesHandlers = usePreferencesHandlers(dialogState);

  // Add a debugging useEffect to confirm dialogState is properly initialized
  useEffect(() => {
    console.log("[useHomeDialogs] Dialog state initialized:", dialogState);
  }, [dialogState]);
  
  // Cleanup effect
  useEffect(() => {
    console.log("[useHomeDialogs] Initializing dialog handlers");
    
    // When component unmounts
    return () => {
      console.log("[useHomeDialogs] Cleaning up dialog handlers");
      closeAllDialogs(dialogState);
    };
  }, [dialogState]);
  
  // Create a debug handler that wraps the original handler
  const debugHandler = useCallback((handler: () => void, name: string) => {
    return () => {
      console.log(`[useHomeDialogs] Debug handler called for: ${name}`);
      handler();
    };
  }, []);
  
  const wrappedHandlers = {
    handleGeneralOpinionClick: debugHandler(generalOpinionHandlers.handleGeneralOpinionClick, "generalOpinionClick"),
    handleExplanationContinue: debugHandler(generalOpinionHandlers.handleExplanationContinue, "explanationContinue"),
    handleLifeSupportClick: debugHandler(lifeSupportHandlers.handleLifeSupportClick, "lifeSupportClick"),
    handleLifeSupportExplanationContinue: debugHandler(lifeSupportHandlers.handleLifeSupportExplanationContinue, "lifeSupportExplanationContinue"),
    handleAdvancedIllnessClick: debugHandler(advancedIllnessHandlers.handleAdvancedIllnessClick, "advancedIllnessClick"),
    handleAdvancedIllnessExplanationContinue: debugHandler(advancedIllnessHandlers.handleAdvancedIllnessExplanationContinue, "advancedIllnessExplanationContinue"),
    handlePreferencesClick: debugHandler(preferencesHandlers.handlePreferencesClick, "preferencesClick"),
    handlePreferencesExplanationContinue: debugHandler(preferencesHandlers.handlePreferencesExplanationContinue, "preferencesExplanationContinue")
  };
  
  return {
    dialogState,
    handlers: wrappedHandlers
  };
}
