
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionsDialog } from "@/components/QuestionsDialog";
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { LifeSupportExplanationDialog } from "@/components/LifeSupportExplanationDialog";
import { LifeSupportQuestionsDialog } from "@/components/LifeSupportQuestionsDialog";
import { AdvancedIllnessExplanationDialog } from "@/components/AdvancedIllnessExplanationDialog";
import { AdvancedIllnessQuestionsDialog } from "@/components/AdvancedIllnessQuestionsDialog";
import { PreferencesExplanationDialog } from "@/components/PreferencesExplanationDialog";
import { PreferencesQuestionsDialog } from "@/components/PreferencesQuestionsDialog";
import { MainButtons } from "@/components/home/MainButtons";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { useDialogState } from "@/hooks/useDialogState";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const navigate = useNavigate();
  const [showSections, setShowSections] = useState(false);
  const dialogState = useDialogState();
  const { t } = useLanguage();

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

  const navigateToGuideInfo = () => {
    navigate("/more-info");
  };

  const navigateToAppInfo = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Vos directives anticipées en toute simplicité
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 text-center">
            Rédigez vos directives anticipées et désignez vos personnes de confiance
            en quelques étapes simples et sécurisées.
          </p>

          {!showSections ? (
            <div className="flex flex-col space-y-4 max-w-lg mx-auto">
              <Button
                size="lg"
                onClick={() => setShowSections(true)}
              >
                Commencer
              </Button>
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={navigateToGuideInfo}
                  className="text-sm md:text-base text-center h-auto py-2"
                >
                  Pourquoi et comment rédiger mes directives anticipées ?
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={navigateToAppInfo}
                  className="text-sm md:text-base h-auto py-2"
                >
                  Informations sur l'application DirectivesPlus
                </Button>
              </div>
            </div>
          ) : (
            <MainButtons 
              onGeneralOpinionClick={handleGeneralOpinionClick}
              onLifeSupportClick={handleLifeSupportClick}
              onAdvancedIllnessClick={handleAdvancedIllnessClick}
              onPreferencesClick={handlePreferencesClick}
            />
          )}

          <FeatureHighlights />
        </div>
      </main>

      <ExplanationDialog 
        open={dialogState.explanationOpen}
        onOpenChange={dialogState.setExplanationOpen}
        onContinue={handleExplanationContinue}
      />

      <QuestionsDialog 
        open={dialogState.questionsOpen}
        onOpenChange={dialogState.setQuestionsOpen}
      />

      <LifeSupportExplanationDialog
        open={dialogState.lifeSupportExplanationOpen}
        onOpenChange={dialogState.setLifeSupportExplanationOpen}
        onContinue={handleLifeSupportExplanationContinue}
      />

      <LifeSupportQuestionsDialog
        open={dialogState.lifeSupportQuestionsOpen}
        onOpenChange={dialogState.setLifeSupportQuestionsOpen}
      />

      <AdvancedIllnessExplanationDialog
        open={dialogState.advancedIllnessExplanationOpen}
        onOpenChange={dialogState.setAdvancedIllnessExplanationOpen}
        onContinue={handleAdvancedIllnessExplanationContinue}
      />

      <AdvancedIllnessQuestionsDialog
        open={dialogState.advancedIllnessQuestionsOpen}
        onOpenChange={dialogState.setAdvancedIllnessQuestionsOpen}
      />

      <PreferencesExplanationDialog
        open={dialogState.preferencesExplanationOpen}
        onOpenChange={dialogState.setPreferencesExplanationOpen}
        onContinue={handlePreferencesExplanationContinue}
      />

      <PreferencesQuestionsDialog
        open={dialogState.preferencesQuestionsOpen}
        onOpenChange={dialogState.setPreferencesQuestionsOpen}
      />
    </div>
  );
};

export default Index;
