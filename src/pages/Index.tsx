import { Header } from "@/components/Header";
import { useState } from "react";
import { useDialogState } from "@/hooks/useDialogState";
import { DialogsContainer } from "@/components/home/DialogsContainer";
import { HomeContent } from "@/components/home/HomeContent";
import { InfoSection } from "@/components/home/InfoSection";

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

  const handleLearnMore = () => {
    setShowMoreInfo(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {showMoreInfo ? (
          <InfoSection />
        ) : (
          <HomeContent 
            onShowMoreInfo={handleLearnMore}
            onGeneralOpinionClick={handleGeneralOpinionClick}
            onLifeSupportClick={handleLifeSupportClick}
            onAdvancedIllnessClick={handleAdvancedIllnessClick}
            onPreferencesClick={handlePreferencesClick}
          />
        )}
      </main>

      <DialogsContainer>
        {/* Dialogs will be rendered here */}
      </DialogsContainer>
    </div>
  );
};

export default Index;
