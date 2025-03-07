
import { useDialogState } from "@/hooks/useDialogState";
import { useGeneralOpinionDialogs } from "./dialogs/useGeneralOpinionDialogs";
import { useLifeSupportDialogs } from "./dialogs/useLifeSupportDialogs";
import { useAdvancedIllnessDialogs } from "./dialogs/useAdvancedIllnessDialogs";
import { usePreferencesDialogs } from "./dialogs/usePreferencesDialogs";

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
  
  const generalOpinionHandlers = useGeneralOpinionDialogs(dialogState);
  const lifeSupportHandlers = useLifeSupportDialogs(dialogState);
  const advancedIllnessHandlers = useAdvancedIllnessDialogs(dialogState);
  const preferencesHandlers = usePreferencesDialogs(dialogState);
  
  return {
    dialogState,
    handlers: {
      handleGeneralOpinionClick: generalOpinionHandlers.handleGeneralOpinionClick,
      handleExplanationContinue: generalOpinionHandlers.handleExplanationContinue,
      handleLifeSupportClick: lifeSupportHandlers.handleLifeSupportClick,
      handleLifeSupportExplanationContinue: lifeSupportHandlers.handleLifeSupportExplanationContinue,
      handleAdvancedIllnessClick: advancedIllnessHandlers.handleAdvancedIllnessClick,
      handleAdvancedIllnessExplanationContinue: advancedIllnessHandlers.handleAdvancedIllnessExplanationContinue,
      handlePreferencesClick: preferencesHandlers.handlePreferencesClick,
      handlePreferencesExplanationContinue: preferencesHandlers.handlePreferencesExplanationContinue
    }
  };
}
