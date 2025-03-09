
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { useDialogState } from "@/hooks/useDialogState";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { LearnMoreSection } from "@/components/home/LearnMoreSection";
import { DialogsContainer } from "@/components/home/DialogsContainer";

const Index = () => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const dialogState = useDialogState();

  const handleGeneralOpinionClick = () => {
    dialogState.setExplanationOpen(true);
  };

  const handleLifeSupportClick = () => {
    dialogState.setLifeSupportExplanationOpen(true);
  };

  const handleAdvancedIllnessClick = () => {
    dialogState.setAdvancedIllnessExplanationOpen(true);
  };

  const handlePreferencesClick = () => {
    dialogState.setPreferencesExplanationOpen(true);
  };

  const handleShowMoreInfo = () => {
    setShowMoreInfo(true);
  };

  const handleBackToHome = () => {
    setShowMoreInfo(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {showMoreInfo ? (
          <>
            <LearnMoreSection />
            <Button
              variant="outline"
              onClick={handleBackToHome}
              className="mt-8 mx-auto block"
            >
              Retour à l'accueil
            </Button>
          </>
        ) : (
          <>
            <WelcomeSection 
              onShowMoreInfo={handleShowMoreInfo}
              onGeneralOpinionClick={handleGeneralOpinionClick}
              onLifeSupportClick={handleLifeSupportClick}
              onAdvancedIllnessClick={handleAdvancedIllnessClick}
              onPreferencesClick={handlePreferencesClick}
            />
            <FeatureHighlights />
          </>
        )}
      </main>

      <DialogsContainer />
    </div>
  );
};

export default Index;
