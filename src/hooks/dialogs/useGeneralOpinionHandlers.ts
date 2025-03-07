
import { createHandleButtonClick, createHandleExplanationContinue } from "./useDialogUtils";
import { useCallback } from "react";

export const useGeneralOpinionHandlers = (
  dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>
) => {
  const handleGeneralOpinionClick = useCallback(() => {
    console.log("[useGeneralOpinionHandlers] General Opinion click handler called");
    const handler = createHandleButtonClick(
      dialogState,
      dialogState.setExplanationOpen,
      "General Opinion"
    );
    handler();
  }, [dialogState]);

  const handleExplanationContinue = useCallback(() => {
    console.log("[useGeneralOpinionHandlers] Explanation continue handler called");
    const handler = createHandleExplanationContinue(
      dialogState,
      dialogState.setQuestionsOpen,
      "General Opinion"
    );
    handler();
  }, [dialogState]);

  return {
    handleGeneralOpinionClick,
    handleExplanationContinue
  };
};
