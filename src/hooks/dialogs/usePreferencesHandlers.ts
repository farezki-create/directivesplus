
import { createHandleButtonClick, createHandleExplanationContinue } from "./useDialogUtils";

export const usePreferencesHandlers = (
  dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>
) => {
  const handlePreferencesClick = createHandleButtonClick(
    dialogState,
    dialogState.setPreferencesExplanationOpen,
    "Preferences"
  );

  const handlePreferencesExplanationContinue = createHandleExplanationContinue(
    dialogState,
    dialogState.setPreferencesQuestionsOpen,
    "Preferences"
  );

  return {
    handlePreferencesClick,
    handlePreferencesExplanationContinue
  };
};
