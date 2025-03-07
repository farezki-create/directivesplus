
import { createHandleButtonClick, createHandleExplanationContinue } from "./useDialogUtils";

export const useLifeSupportHandlers = (
  dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>
) => {
  const handleLifeSupportClick = createHandleButtonClick(
    dialogState,
    dialogState.setLifeSupportExplanationOpen,
    "Life Support"
  );

  const handleLifeSupportExplanationContinue = createHandleExplanationContinue(
    dialogState,
    dialogState.setLifeSupportQuestionsOpen,
    "Life Support"
  );

  return {
    handleLifeSupportClick,
    handleLifeSupportExplanationContinue
  };
};
