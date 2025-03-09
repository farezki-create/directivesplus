
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { QuestionsDialog } from "@/components/QuestionsDialog";
import { LifeSupportExplanationDialog } from "@/components/LifeSupportExplanationDialog";
import { LifeSupportQuestionsDialog } from "@/components/LifeSupportQuestionsDialog";
import { AdvancedIllnessExplanationDialog } from "@/components/AdvancedIllnessExplanationDialog";
import { AdvancedIllnessQuestionsDialog } from "@/components/AdvancedIllnessQuestionsDialog";
import { PreferencesExplanationDialog } from "@/components/PreferencesExplanationDialog";
import { PreferencesQuestionsDialog } from "@/components/PreferencesQuestionsDialog";
import { useDialogState } from "@/hooks/useDialogState";

export function DialogsContainer() {
  const dialogState = useDialogState();

  return (
    <>
      <ExplanationDialog 
        open={dialogState.explanationOpen}
        onOpenChange={dialogState.setExplanationOpen}
        onContinue={() => {
          dialogState.setExplanationOpen(false);
          dialogState.setQuestionsOpen(true);
        }}
      />

      <QuestionsDialog 
        open={dialogState.questionsOpen}
        onOpenChange={dialogState.setQuestionsOpen}
      />

      <LifeSupportExplanationDialog
        open={dialogState.lifeSupportExplanationOpen}
        onOpenChange={dialogState.setLifeSupportExplanationOpen}
        onContinue={() => {
          dialogState.setLifeSupportExplanationOpen(false);
          dialogState.setLifeSupportQuestionsOpen(true);
        }}
      />

      <LifeSupportQuestionsDialog
        open={dialogState.lifeSupportQuestionsOpen}
        onOpenChange={dialogState.setLifeSupportQuestionsOpen}
      />

      <AdvancedIllnessExplanationDialog
        open={dialogState.advancedIllnessExplanationOpen}
        onOpenChange={dialogState.setAdvancedIllnessExplanationOpen}
        onContinue={() => {
          dialogState.setAdvancedIllnessExplanationOpen(false);
          dialogState.setAdvancedIllnessQuestionsOpen(true);
        }}
      />

      <AdvancedIllnessQuestionsDialog
        open={dialogState.advancedIllnessQuestionsOpen}
        onOpenChange={dialogState.setAdvancedIllnessQuestionsOpen}
      />

      <PreferencesExplanationDialog
        open={dialogState.preferencesExplanationOpen}
        onOpenChange={dialogState.setPreferencesExplanationOpen}
        onContinue={() => {
          dialogState.setPreferencesExplanationOpen(false);
          dialogState.setPreferencesQuestionsOpen(true);
        }}
      />

      <PreferencesQuestionsDialog
        open={dialogState.preferencesQuestionsOpen}
        onOpenChange={dialogState.setPreferencesQuestionsOpen}
      />
    </>
  );
}
