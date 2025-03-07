
import { useState, useCallback } from "react";

export function useDialogState() {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [lifeSupportExplanationOpen, setLifeSupportExplanationOpen] = useState(false);
  const [lifeSupportQuestionsOpen, setLifeSupportQuestionsOpen] = useState(false);
  const [advancedIllnessExplanationOpen, setAdvancedIllnessExplanationOpen] = useState(false);
  const [advancedIllnessQuestionsOpen, setAdvancedIllnessQuestionsOpen] = useState(false);
  const [preferencesExplanationOpen, setPreferencesExplanationOpen] = useState(false);
  const [preferencesQuestionsOpen, setPreferencesQuestionsOpen] = useState(false);

  // Create wrapped setters with console logging for debugging
  const setExplanationOpenWithLog = useCallback((value: boolean) => {
    console.log(`[useDialogState] Setting explanationOpen to: ${value}`);
    setExplanationOpen(value);
  }, []);

  const setQuestionsOpenWithLog = useCallback((value: boolean) => {
    console.log(`[useDialogState] Setting questionsOpen to: ${value}`);
    setQuestionsOpen(value);
  }, []);

  return {
    explanationOpen,
    setExplanationOpen: setExplanationOpenWithLog,
    questionsOpen,
    setQuestionsOpen: setQuestionsOpenWithLog,
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
}
