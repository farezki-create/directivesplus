
// Utility functions for dialog management
export const closeAllDialogs = (dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>) => {
  console.log("[useDialogUtils] Closing all dialogs");
  dialogState.setExplanationOpen(false);
  dialogState.setQuestionsOpen(false);
  dialogState.setLifeSupportExplanationOpen(false);
  dialogState.setLifeSupportQuestionsOpen(false);
  dialogState.setAdvancedIllnessExplanationOpen(false);
  dialogState.setAdvancedIllnessQuestionsOpen(false);
  dialogState.setPreferencesExplanationOpen(false);
  dialogState.setPreferencesQuestionsOpen(false);
};

export const createHandleButtonClick = (
  dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>,
  setExplanationDialogOpen: (open: boolean) => void,
  logPrefix: string
) => {
  return () => {
    console.log(`[useDialogUtils] ${logPrefix} button clicked`);
    closeAllDialogs(dialogState);
    
    // Use setTimeout to ensure state updates have propagated
    setTimeout(() => {
      console.log(`[useDialogUtils] Opening ${logPrefix.toLowerCase()} explanation dialog`);
      setExplanationDialogOpen(true);
    }, 100);
  };
};

export const createHandleExplanationContinue = (
  dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>,
  setQuestionsDialogOpen: (open: boolean) => void,
  logPrefix: string
) => {
  return () => {
    console.log(`[useDialogUtils] Continuing from ${logPrefix.toLowerCase()} explanation to questions`);
    
    setTimeout(() => {
      console.log(`[useDialogUtils] Opening ${logPrefix.toLowerCase()} questions dialog`);
      setQuestionsDialogOpen(true);
    }, 600);
  };
};
