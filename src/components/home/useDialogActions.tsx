
import { useDialogState } from "@/hooks/useDialogState";

export function useDialogActions() {
  const dialogState = useDialogState();

  const handleGeneralOpinionClick = () => {
    dialogState.setExplanationOpen(true);
  };

  const handleExplanationContinue = () => {
    dialogState.setExplanationOpen(false);
    dialogState.setQuestionsOpen(true);
  };

  const handleLifeSupportClick = () => {
    dialogState.setLifeSupportExplanationOpen(true);
  };

  const handleLifeSupportExplanationContinue = () => {
    dialogState.setLifeSupportExplanationOpen(false);
    dialogState.setLifeSupportQuestionsOpen(true);
  };

  const handleAdvancedIllnessClick = () => {
    dialogState.setAdvancedIllnessExplanationOpen(true);
  };

  const handleAdvancedIllnessExplanationContinue = () => {
    dialogState.setAdvancedIllnessExplanationOpen(false);
    dialogState.setAdvancedIllnessQuestionsOpen(true);
  };

  const handlePreferencesClick = () => {
    dialogState.setPreferencesExplanationOpen(true);
  };

  const handlePreferencesExplanationContinue = () => {
    dialogState.setPreferencesExplanationOpen(false);
    dialogState.setPreferencesQuestionsOpen(true);
  };

  return {
    handleGeneralOpinionClick,
    handleExplanationContinue,
    handleLifeSupportClick,
    handleLifeSupportExplanationContinue,
    handleAdvancedIllnessClick,
    handleAdvancedIllnessExplanationContinue,
    handlePreferencesClick,
    handlePreferencesExplanationContinue
  };
}
