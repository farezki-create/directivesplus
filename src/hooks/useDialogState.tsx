import { useState } from "react";

export function useDialogState() {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [lifeSupportExplanationOpen, setLifeSupportExplanationOpen] = useState(false);
  const [lifeSupportQuestionsOpen, setLifeSupportQuestionsOpen] = useState(false);
  const [advancedIllnessExplanationOpen, setAdvancedIllnessExplanationOpen] = useState(false);
  const [advancedIllnessQuestionsOpen, setAdvancedIllnessQuestionsOpen] = useState(false);
  const [preferencesExplanationOpen, setPreferencesExplanationOpen] = useState(false);
  const [preferencesQuestionsOpen, setPreferencesQuestionsOpen] = useState(false);

  return {
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
}