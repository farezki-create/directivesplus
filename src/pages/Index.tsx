
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { useDialogState } from "@/hooks/useDialogState";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { LearnMoreSection } from "@/components/home/LearnMoreSection";
import { DialogsContainer } from "@/components/home/DialogsContainer";
import { useLocation } from "react-router-dom";

const Index = () => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showWritingSection, setShowWritingSection] = useState(false);
  const dialogState = useDialogState();
  const location = useLocation();

  useEffect(() => {
    // Check for the writing parameter in the URL and show writing section if present
    const params = new URLSearchParams(location.search);
    if (params.get('writing') === 'true') {
      setShowWritingSection(true);
      // Scroll to the buttons section for better visibility
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const handleGeneralOpinionClick = () => {
    dialogState.setQuestionsOpen(true);
  };

  const handleLifeSupportClick = () => {
    dialogState.setLifeSupportQuestionsOpen(true);
  };

  const handleAdvancedIllnessClick = () => {
    dialogState.setAdvancedIllnessQuestionsOpen(true);
  };

  const handlePreferencesClick = () => {
    dialogState.setPreferencesQuestionsOpen(true);
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
              showWritingSection={showWritingSection}
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
