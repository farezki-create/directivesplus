
import { useState } from "react";
import { Header } from "@/components/Header";
import { MainButtons } from "@/components/home/MainButtons";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { useLanguage } from "@/hooks/useLanguage";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { MoreInfoSection } from "@/components/home/MoreInfoSection";
import { DialogManager } from "@/components/home/DialogManager";
import { useDialogActions } from "@/components/home/useDialogActions";

const Index = () => {
  const [showSections, setShowSections] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const { currentLanguage } = useLanguage();
  const dialogActions = useDialogActions();

  const handleLearnMore = () => {
    setShowMoreInfo(true);
  };

  const handleBackToHome = () => {
    setShowMoreInfo(false);
  };

  if (showMoreInfo) {
    return <MoreInfoSection onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!showSections ? (
          <WelcomeSection 
            onGetStarted={() => setShowSections(true)} 
            onLearnMore={handleLearnMore} 
          />
        ) : (
          <MainButtons 
            onGeneralOpinionClick={dialogActions.handleGeneralOpinionClick}
            onLifeSupportClick={dialogActions.handleLifeSupportClick}
            onAdvancedIllnessClick={dialogActions.handleAdvancedIllnessClick}
            onPreferencesClick={dialogActions.handlePreferencesClick}
          />
        )}

        <FeatureHighlights />
      </main>

      <DialogManager 
        onGeneralExplanationContinue={dialogActions.handleExplanationContinue}
        onLifeSupportExplanationContinue={dialogActions.handleLifeSupportExplanationContinue}
        onAdvancedIllnessExplanationContinue={dialogActions.handleAdvancedIllnessExplanationContinue}
        onPreferencesExplanationContinue={dialogActions.handlePreferencesExplanationContinue}
      />
    </div>
  );
};

export default Index;
