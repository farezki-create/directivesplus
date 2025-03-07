
export interface DialogHandlers {
  handleGeneralOpinionClick: () => void;
  handleExplanationContinue: () => void;
  handleLifeSupportClick: () => void;
  handleLifeSupportExplanationContinue: () => void;
  handleAdvancedIllnessClick: () => void;
  handleAdvancedIllnessExplanationContinue: () => void;
  handlePreferencesClick: () => void;
  handlePreferencesExplanationContinue: () => void;
}

export interface UseHomeDialogsReturn {
  dialogState: ReturnType<typeof import("@/hooks/useDialogState").useDialogState>;
  handlers: DialogHandlers;
}
