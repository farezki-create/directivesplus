
import { createHandleButtonClick, createHandleExplanationContinue } from "./useDialogUtils";

export const useAdvancedIllnessHandlers = (
  dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>
) => {
  const handleAdvancedIllnessClick = createHandleButtonClick(
    dialogState,
    dialogState.setAdvancedIllnessExplanationOpen,
    "Advanced Illness"
  );

  const handleAdvancedIllnessExplanationContinue = createHandleExplanationContinue(
    dialogState,
    dialogState.setAdvancedIllnessQuestionsOpen,
    "Advanced Illness"
  );

  return {
    handleAdvancedIllnessClick,
    handleAdvancedIllnessExplanationContinue
  };
};
