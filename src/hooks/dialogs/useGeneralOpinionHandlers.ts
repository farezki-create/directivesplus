
import { createHandleButtonClick, createHandleExplanationContinue } from "./useDialogUtils";

export const useGeneralOpinionHandlers = (
  dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>
) => {
  const handleGeneralOpinionClick = createHandleButtonClick(
    dialogState,
    dialogState.setExplanationOpen,
    "General Opinion"
  );

  const handleExplanationContinue = createHandleExplanationContinue(
    dialogState,
    dialogState.setQuestionsOpen,
    "General Opinion"
  );

  return {
    handleGeneralOpinionClick,
    handleExplanationContinue
  };
};
