
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { QuestionsDialog } from "@/components/QuestionsDialog";
import { LifeSupportQuestionsDialog } from "@/components/LifeSupportQuestionsDialog";
import { AdvancedIllnessQuestionsDialog } from "@/components/AdvancedIllnessQuestionsDialog";
import { PreferencesQuestionsDialog } from "@/components/PreferencesQuestionsDialog";
import { useHomeDialogs } from "@/hooks/useHomeDialogs";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useEffect } from "react";

export function HomeDialogs() {
  const { dialogState, handlers } = useHomeDialogs();
  const { t, currentLanguage } = useLanguage();
  
  // Add an effect to log dialog state changes
  useEffect(() => {
    console.log("[HomeDialogs] Dialog states:", {
      explanation: dialogState.explanationOpen,
      questions: dialogState.questionsOpen,
      lifeSupportExplanation: dialogState.lifeSupportExplanationOpen,
      lifeSupportQuestions: dialogState.lifeSupportQuestionsOpen,
      advancedIllnessExplanation: dialogState.advancedIllnessExplanationOpen,
      advancedIllnessQuestions: dialogState.advancedIllnessQuestionsOpen,
      preferencesExplanation: dialogState.preferencesExplanationOpen,
      preferencesQuestions: dialogState.preferencesQuestionsOpen
    });
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
  
  // Content for the general opinion explanation
  const generalOpinionContent = currentLanguage === 'fr' 
    ? "Cette section vous permet d'exprimer vos souhaits généraux concernant vos soins médicaux. Pour chaque question, vous pouvez répondre par OUI ou NON. Vos réponses aideront les médecins et vos proches à comprendre vos souhaits et à prendre des décisions conformes à vos valeurs si vous ne pouvez plus vous exprimer."
    : "This section allows you to express your general wishes regarding your medical care. For each question, you can answer YES or NO. Your answers will help doctors and your loved ones understand your wishes and make decisions in accordance with your values if you can no longer express yourself.";
  
  // Content for life support explanation
  const lifeSupportContent = currentLanguage === 'fr'
    ? "Dans cette section, vous allez pouvoir indiquer vos souhaits concernant les traitements de maintien en vie. Ces décisions sont importantes et peuvent aider le personnel médical à respecter vos volontés si vous ne pouvez plus les exprimer."
    : "In this section, you can indicate your wishes regarding life support treatments. These decisions are important and can help medical staff respect your wishes if you can no longer express them.";
  
  // Content for advanced illness explanation
  const advancedIllnessContent = currentLanguage === 'fr'
    ? "Cette section concerne vos préférences en cas de maladie grave. Vous pouvez indiquer quels traitements vous souhaiteriez recevoir ou non dans différentes situations médicales critiques."
    : "This section concerns your preferences in case of serious illness. You can indicate which treatments you would like to receive or not in different critical medical situations.";
  
  // Content for preferences explanation
  const preferencesContent = currentLanguage === 'fr'
    ? "Dans cette section, vous pouvez spécifier vos préférences personnelles concernant vos soins, comme vos croyances religieuses, vos valeurs ou d'autres aspects importants pour vous."
    : "In this section, you can specify your personal preferences regarding your care, such as your religious beliefs, values, or other aspects that are important to you.";

  return (
    <>
      {/* General Opinion */}
      <ExplanationDialog
        open={dialogState.explanationOpen}
        onOpenChange={dialogState.setExplanationOpen}
        onContinue={handlers.handleExplanationContinue}
        title={t('generalOpinion')}
        description={t('generalOpinionDesc')}
        content={generalOpinionContent}
      />
      <QuestionsDialog
        open={dialogState.questionsOpen}
        onOpenChange={dialogState.setQuestionsOpen}
      />
      
      {/* Life Support */}
      <ExplanationDialog
        open={dialogState.lifeSupportExplanationOpen}
        onOpenChange={dialogState.setLifeSupportExplanationOpen}
        onContinue={handlers.handleLifeSupportExplanationContinue}
        title={t('lifeSupport')}
        description={t('lifeSupportDesc')}
        content={lifeSupportContent}
      />
      <LifeSupportQuestionsDialog
        open={dialogState.lifeSupportQuestionsOpen}
        onOpenChange={dialogState.setLifeSupportQuestionsOpen}
      />
      
      {/* Advanced Illness */}
      <ExplanationDialog
        open={dialogState.advancedIllnessExplanationOpen}
        onOpenChange={dialogState.setAdvancedIllnessExplanationOpen}
        onContinue={handlers.handleAdvancedIllnessExplanationContinue}
        title={t('advancedIllnessTitle')}
        description={t('advancedIllnessDesc')}
        content={advancedIllnessContent}
      />
      <AdvancedIllnessQuestionsDialog
        open={dialogState.advancedIllnessQuestionsOpen}
        onOpenChange={dialogState.setAdvancedIllnessQuestionsOpen}
      />
      
      {/* Preferences */}
      <ExplanationDialog
        open={dialogState.preferencesExplanationOpen}
        onOpenChange={dialogState.setPreferencesExplanationOpen}
        onContinue={handlers.handlePreferencesExplanationContinue}
        title={t('preferences')}
        description={t('preferencesDesc')}
        content={preferencesContent}
      />
      <PreferencesQuestionsDialog
        open={dialogState.preferencesQuestionsOpen}
        onOpenChange={dialogState.setPreferencesQuestionsOpen}
      />
    </>
  );
}
