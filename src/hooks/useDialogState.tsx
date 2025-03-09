
import { useState, createContext, useContext, ReactNode } from "react";

interface DialogState {
  explanationOpen: boolean;
  setExplanationOpen: (open: boolean) => void;
  questionsOpen: boolean;
  setQuestionsOpen: (open: boolean) => void;
  lifeSupportExplanationOpen: boolean;
  setLifeSupportExplanationOpen: (open: boolean) => void;
  lifeSupportQuestionsOpen: boolean;
  setLifeSupportQuestionsOpen: (open: boolean) => void;
  advancedIllnessExplanationOpen: boolean;
  setAdvancedIllnessExplanationOpen: (open: boolean) => void;
  advancedIllnessQuestionsOpen: boolean;
  setAdvancedIllnessQuestionsOpen: (open: boolean) => void;
  preferencesExplanationOpen: boolean;
  setPreferencesExplanationOpen: (open: boolean) => void;
  preferencesQuestionsOpen: boolean;
  setPreferencesQuestionsOpen: (open: boolean) => void;
}

const DialogStateContext = createContext<DialogState | undefined>(undefined);

export function DialogStateProvider({ children }: { children: ReactNode }) {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [lifeSupportExplanationOpen, setLifeSupportExplanationOpen] = useState(false);
  const [lifeSupportQuestionsOpen, setLifeSupportQuestionsOpen] = useState(false);
  const [advancedIllnessExplanationOpen, setAdvancedIllnessExplanationOpen] = useState(false);
  const [advancedIllnessQuestionsOpen, setAdvancedIllnessQuestionsOpen] = useState(false);
  const [preferencesExplanationOpen, setPreferencesExplanationOpen] = useState(false);
  const [preferencesQuestionsOpen, setPreferencesQuestionsOpen] = useState(false);

  return (
    <DialogStateContext.Provider
      value={{
        explanationOpen,
        setExplanationOpen,
        questionsOpen,
        setQuestionsOpen,
        lifeSupportExplanationOpen,
        setLifeSupportExplanationOpen,
        lifeSupportQuestionsOpen,
        setLifeSupportQuestionsOpen,
        advancedIllnessExplanationOpen,
        setAdvancedIllnessExplanationOpen,
        advancedIllnessQuestionsOpen,
        setAdvancedIllnessQuestionsOpen,
        preferencesExplanationOpen,
        setPreferencesExplanationOpen,
        preferencesQuestionsOpen,
        setPreferencesQuestionsOpen,
      }}
    >
      {children}
    </DialogStateContext.Provider>
  );
}

export function useDialogState(): DialogState {
  const context = useContext(DialogStateContext);
  
  if (context === undefined) {
    throw new Error("useDialogState must be used within a DialogStateProvider");
  }
  
  return context;
}
