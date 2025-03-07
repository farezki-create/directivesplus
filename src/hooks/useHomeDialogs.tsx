
import { useDialogState } from "@/hooks/useDialogState";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
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
  
  // Cleanup effect
  useEffect(() => {
    console.log("[useHomeDialogs] Initializing dialog handlers");
    return () => {
      console.log("[useHomeDialogs] Cleaning up dialog handlers");
      closeAllDialogs(dialogState);
    };
  }, []);
  
  return {
    dialogState,
    handlers: {
      ...generalOpinionHandlers,
      ...lifeSupportHandlers,
      ...advancedIllnessHandlers,
      ...preferencesHandlers
    }
  };
}
