
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

  const setLifeSupportExplanationOpenWithLog = useCallback((value: boolean) => {
    console.log(`[useDialogState] Setting lifeSupportExplanationOpen to: ${value}`);
    setLifeSupportExplanationOpen(value);
  }, []);

  const setLifeSupportQuestionsOpenWithLog = useCallback((value: boolean) => {
    console.log(`[useDialogState] Setting lifeSupportQuestionsOpen to: ${value}`);
    setLifeSupportQuestionsOpen(value);
  }, []);

  const setAdvancedIllnessExplanationOpenWithLog = useCallback((value: boolean) => {
    console.log(`[useDialogState] Setting advancedIllnessExplanationOpen to: ${value}`);
    setAdvancedIllnessExplanationOpen(value);
  }, []);

  const setAdvancedIllnessQuestionsOpenWithLog = useCallback((value: boolean) => {
    console.log(`[useDialogState] Setting advancedIllnessQuestionsOpen to: ${value}`);
    setAdvancedIllnessQuestionsOpen(value);
  }, []);

  const setPreferencesExplanationOpenWithLog = useCallback((value: boolean) => {
    console.log(`[useDialogState] Setting preferencesExplanationOpen to: ${value}`);
    setPreferencesExplanationOpen(value);
  }, []);

  const setPreferencesQuestionsOpenWithLog = useCallback((value: boolean) => {
    console.log(`[useDialogState] Setting preferencesQuestionsOpen to: ${value}`);
    setPreferencesQuestionsOpen(value);
  }, []);

  return {
    explanationOpen,
    setExplanationOpen: setExplanationOpenWithLog,
    questionsOpen,
    setQuestionsOpen: setQuestionsOpenWithLog,
    lifeSupportExplanationOpen,
    setLifeSupportExplanationOpen: setLifeSupportExplanationOpenWithLog,
    lifeSupportQuestionsOpen,
    setLifeSupportQuestionsOpen: setLifeSupportQuestionsOpenWithLog,
    advancedIllnessExplanationOpen,
    setAdvancedIllnessExplanationOpen: setAdvancedIllnessExplanationOpenWithLog,
    advancedIllnessQuestionsOpen,
    setAdvancedIllnessQuestionsOpen: setAdvancedIllnessQuestionsOpenWithLog,
    preferencesExplanationOpen,
    setPreferencesExplanationOpen: setPreferencesExplanationOpenWithLog,
    preferencesQuestionsOpen,
    setPreferencesQuestionsOpen: setPreferencesQuestionsOpenWithLog,
  };
}
