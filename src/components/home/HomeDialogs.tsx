
import { useEffect } from "react";
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { QuestionsDialog } from "@/components/QuestionsDialog";
import { LifeSupportExplanationDialog } from "@/components/LifeSupportExplanationDialog";
import { LifeSupportQuestionsDialog } from "@/components/LifeSupportQuestionsDialog";
import { AdvancedIllnessExplanationDialog } from "@/components/AdvancedIllnessExplanationDialog";
import { AdvancedIllnessQuestionsDialog } from "@/components/AdvancedIllnessQuestionsDialog";
import { PreferencesExplanationDialog } from "@/components/PreferencesExplanationDialog";
import { PreferencesQuestionsDialog } from "@/components/PreferencesQuestionsDialog";
import { useHomeDialogs } from "@/hooks/useHomeDialogs";
import { FC } from "react";

export const HomeDialogs: FC = () => {
  const { dialogState, handlers } = useHomeDialogs();
  
  useEffect(() => {
    const anyDialogOpen = 
      dialogState.explanationOpen || 
      dialogState.questionsOpen || 
      dialogState.lifeSupportExplanationOpen || 
      dialogState.lifeSupportQuestionsOpen ||
      dialogState.advancedIllnessExplanationOpen ||
      dialogState.advancedIllnessQuestionsOpen ||
      dialogState.preferencesExplanationOpen ||
      dialogState.preferencesQuestionsOpen;
      
    if (anyDialogOpen) {
      console.log("[HomeDialogs] Dialog state changed:", {
        explanationOpen: dialogState.explanationOpen,
        questionsOpen: dialogState.questionsOpen,
        lifeSupportExplanationOpen: dialogState.lifeSupportExplanationOpen,
        lifeSupportQuestionsOpen: dialogState.lifeSupportQuestionsOpen,
        advancedIllnessExplanationOpen: dialogState.advancedIllnessExplanationOpen,
        advancedIllnessQuestionsOpen: dialogState.advancedIllnessQuestionsOpen,
        preferencesExplanationOpen: dialogState.preferencesExplanationOpen,
        preferencesQuestionsOpen: dialogState.preferencesQuestionsOpen
      });
    }
  }, [
    dialogState.explanationOpen,
    dialogState.questionsOpen,
    dialogState.lifeSupportExplanationOpen,
    dialogState.lifeSupportQuestionsOpen,
    dialogState.advancedIllnessExplanationOpen,
    dialogState.advancedIllnessQuestionsOpen,
    dialogState.preferencesExplanationOpen,
    dialogState.preferencesQuestionsOpen
  ]);

  return (
    <>
      <ExplanationDialog 
        open={dialogState.explanationOpen}
        onOpenChange={dialogState.setExplanationOpen}
        onContinue={handlers.handleExplanationContinue}
      />

      <QuestionsDialog 
        open={dialogState.questionsOpen}
        onOpenChange={dialogState.setQuestionsOpen}
      />

      <LifeSupportExplanationDialog
        open={dialogState.lifeSupportExplanationOpen}
        onOpenChange={dialogState.setLifeSupportExplanationOpen}
        onContinue={handlers.handleLifeSupportExplanationContinue}
      />

      <LifeSupportQuestionsDialog
        open={dialogState.lifeSupportQuestionsOpen}
        onOpenChange={dialogState.setLifeSupportQuestionsOpen}
      />

      <AdvancedIllnessExplanationDialog
        open={dialogState.advancedIllnessExplanationOpen}
        onOpenChange={dialogState.setAdvancedIllnessExplanationOpen}
        onContinue={handlers.handleAdvancedIllnessExplanationContinue}
      />

      <AdvancedIllnessQuestionsDialog
        open={dialogState.advancedIllnessQuestionsOpen}
        onOpenChange={dialogState.setAdvancedIllnessQuestionsOpen}
      />

      <PreferencesExplanationDialog
        open={dialogState.preferencesExplanationOpen}
        onOpenChange={dialogState.setPreferencesExplanationOpen}
        onContinue={handlers.handlePreferencesExplanationContinue}
      />

      <PreferencesQuestionsDialog
        open={dialogState.preferencesQuestionsOpen}
        onOpenChange={dialogState.setPreferencesQuestionsOpen}
      />
    </>
  );
};
