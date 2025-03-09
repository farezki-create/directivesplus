
import { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of our dialog state
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

// Create a context for the dialog state
const DialogStateContext = createContext<DialogState | undefined>(undefined);

// Provider component to wrap the app and provide dialog state
export function DialogStateProvider({ children }: { children: ReactNode }) {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [lifeSupportExplanationOpen, setLifeSupportExplanationOpen] = useState(false);
  const [lifeSupportQuestionsOpen, setLifeSupportQuestionsOpen] = useState(false);
  const [advancedIllnessExplanationOpen, setAdvancedIllnessExplanationOpen] = useState(false);
  const [advancedIllnessQuestionsOpen, setAdvancedIllnessQuestionsOpen] = useState(false);
  const [preferencesExplanationOpen, setPreferencesExplanationOpen] = useState(false);
  const [preferencesQuestionsOpen, setPreferencesQuestionsOpen] = useState(false);

  // Create the dialog state object to provide
  const dialogState: DialogState = {
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
  };

  return (
    <DialogStateContext.Provider value={dialogState}>
      {children}
    </DialogStateContext.Provider>
  );
}

// Hook to use the dialog state in components
export function useDialogState() {
  const context = useContext(DialogStateContext);
  if (context === undefined) {
    throw new Error("useDialogState must be used within a DialogStateProvider");
  }
  return context;
}
