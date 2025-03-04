
import { QuestionsDialog } from "@/components/QuestionsDialog";
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { LifeSupportExplanationDialog } from "@/components/LifeSupportExplanationDialog";
import { LifeSupportQuestionsDialog } from "@/components/LifeSupportQuestionsDialog";
import { AdvancedIllnessExplanationDialog } from "@/components/AdvancedIllnessExplanationDialog";
import { AdvancedIllnessQuestionsDialog } from "@/components/AdvancedIllnessQuestionsDialog";
import { PreferencesExplanationDialog } from "@/components/PreferencesExplanationDialog";
import { PreferencesQuestionsDialog } from "@/components/PreferencesQuestionsDialog";
import { useDialogState } from "@/hooks/useDialogState";

interface DialogManagerProps {
  onGeneralExplanationContinue: () => void;
  onLifeSupportExplanationContinue: () => void;
  onAdvancedIllnessExplanationContinue: () => void;
  onPreferencesExplanationContinue: () => void;
}

export function DialogManager({
  onGeneralExplanationContinue,
  onLifeSupportExplanationContinue,
  onAdvancedIllnessExplanationContinue,
  onPreferencesExplanationContinue
}: DialogManagerProps) {
  const dialogState = useDialogState();

  return (
    <>
      <ExplanationDialog 
        open={dialogState.explanationOpen}
        onOpenChange={dialogState.setExplanationOpen}
        onContinue={onGeneralExplanationContinue}
      />

      <QuestionsDialog 
        open={dialogState.questionsOpen}
        onOpenChange={dialogState.setQuestionsOpen}
      />

      <LifeSupportExplanationDialog
        open={dialogState.lifeSupportExplanationOpen}
        onOpenChange={dialogState.setLifeSupportExplanationOpen}
        onContinue={onLifeSupportExplanationContinue}
      />

      <LifeSupportQuestionsDialog
        open={dialogState.lifeSupportQuestionsOpen}
        onOpenChange={dialogState.setLifeSupportQuestionsOpen}
      />

      <AdvancedIllnessExplanationDialog
        open={dialogState.advancedIllnessExplanationOpen}
        onOpenChange={dialogState.setAdvancedIllnessExplanationOpen}
        onContinue={onAdvancedIllnessExplanationContinue}
      />

      <AdvancedIllnessQuestionsDialog
        open={dialogState.advancedIllnessQuestionsOpen}
        onOpenChange={dialogState.setAdvancedIllnessQuestionsOpen}
      />

      <PreferencesExplanationDialog
        open={dialogState.preferencesExplanationOpen}
        onOpenChange={dialogState.setPreferencesExplanationOpen}
        onContinue={onPreferencesExplanationContinue}
      />

      <PreferencesQuestionsDialog
        open={dialogState.preferencesQuestionsOpen}
        onOpenChange={dialogState.setPreferencesQuestionsOpen}
      />
    </>
  );
}
