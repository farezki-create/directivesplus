
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

  // Wrapped setters in useCallback to ensure consistent references
  const setExplanationOpenCallback = useCallback((open: boolean) => {
    console.log(`[DialogState] Setting explanation dialog: ${open}`);
    setExplanationOpen(open);
  }, []);

  const setQuestionsOpenCallback = useCallback((open: boolean) => {
    console.log(`[DialogState] Setting questions dialog: ${open}`);
    setQuestionsOpen(open);
  }, []);

  const setLifeSupportExplanationOpenCallback = useCallback((open: boolean) => {
    console.log(`[DialogState] Setting life support explanation dialog: ${open}`);
    setLifeSupportExplanationOpen(open);
  }, []);

  const setLifeSupportQuestionsOpenCallback = useCallback((open: boolean) => {
    console.log(`[DialogState] Setting life support questions dialog: ${open}`);
    setLifeSupportQuestionsOpen(open);
  }, []);

  const setAdvancedIllnessExplanationOpenCallback = useCallback((open: boolean) => {
    console.log(`[DialogState] Setting advanced illness explanation dialog: ${open}`);
    setAdvancedIllnessExplanationOpen(open);
  }, []);

  const setAdvancedIllnessQuestionsOpenCallback = useCallback((open: boolean) => {
    console.log(`[DialogState] Setting advanced illness questions dialog: ${open}`);
    setAdvancedIllnessQuestionsOpen(open);
  }, []);

  const setPreferencesExplanationOpenCallback = useCallback((open: boolean) => {
    console.log(`[DialogState] Setting preferences explanation dialog: ${open}`);
    setPreferencesExplanationOpen(open);
  }, []);

  const setPreferencesQuestionsOpenCallback = useCallback((open: boolean) => {
    console.log(`[DialogState] Setting preferences questions dialog: ${open}`);
    setPreferencesQuestionsOpen(open);
  }, []);

  return {
    explanationOpen,
    setExplanationOpen: setExplanationOpenCallback,
    questionsOpen,
    setQuestionsOpen: setQuestionsOpenCallback,
    lifeSupportExplanationOpen,
    setLifeSupportExplanationOpen: setLifeSupportExplanationOpenCallback,
    lifeSupportQuestionsOpen,
    setLifeSupportQuestionsOpen: setLifeSupportQuestionsOpenCallback,
    advancedIllnessExplanationOpen,
    setAdvancedIllnessExplanationOpen: setAdvancedIllnessExplanationOpenCallback,
    advancedIllnessQuestionsOpen,
    setAdvancedIllnessQuestionsOpen: setAdvancedIllnessQuestionsOpenCallback,
    preferencesExplanationOpen,
    setPreferencesExplanationOpen: setPreferencesExplanationOpenCallback,
    preferencesQuestionsOpen,
    setPreferencesQuestionsOpen: setPreferencesQuestionsOpenCallback,
  };
}
