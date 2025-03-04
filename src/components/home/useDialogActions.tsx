
import { useDialogState } from "@/hooks/useDialogState";

export function useDialogActions() {
  const dialogState = useDialogState();

  const handleGeneralOpinionClick = () => {
    console.log("[DialogActions] Opening general opinion explanation dialog");
    dialogState.setExplanationOpen(true);
  };

  const handleExplanationContinue = () => {
    console.log("[DialogActions] Closing explanation dialog and opening questions dialog");
    dialogState.setExplanationOpen(false);
    dialogState.setQuestionsOpen(true);
  };

  const handleLifeSupportClick = () => {
    console.log("[DialogActions] Opening life support explanation dialog");
    dialogState.setLifeSupportExplanationOpen(true);
  };

  const handleLifeSupportExplanationContinue = () => {
    console.log("[DialogActions] Closing life support explanation dialog and opening life support questions dialog");
    dialogState.setLifeSupportExplanationOpen(false);
    dialogState.setLifeSupportQuestionsOpen(true);
  };

  const handleAdvancedIllnessClick = () => {
    console.log("[DialogActions] Opening advanced illness explanation dialog");
    dialogState.setAdvancedIllnessExplanationOpen(true);
  };

  const handleAdvancedIllnessExplanationContinue = () => {
    console.log("[DialogActions] Closing advanced illness explanation dialog and opening advanced illness questions dialog");
    dialogState.setAdvancedIllnessExplanationOpen(false);
    dialogState.setAdvancedIllnessQuestionsOpen(true);
  };

  const handlePreferencesClick = () => {
    console.log("[DialogActions] Opening preferences explanation dialog");
    dialogState.setPreferencesExplanationOpen(true);
  };

  const handlePreferencesExplanationContinue = () => {
    console.log("[DialogActions] Closing preferences explanation dialog and opening preferences questions dialog");
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
