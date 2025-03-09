
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
    console.log("Opening general opinion dialog");
    dialogState.setExplanationOpen(true);
  };

  const handleLifeSupportClick = () => {
    console.log("Opening life support dialog");
    dialogState.setLifeSupportExplanationOpen(true);
  };

  const handleAdvancedIllnessClick = () => {
    console.log("Opening advanced illness dialog");
    dialogState.setAdvancedIllnessExplanationOpen(true);
  };

  const handlePreferencesClick = () => {
    console.log("Opening preferences dialog");
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
        {/* Empty fragment to satisfy the children prop requirement */}
        <></>
      </DialogsContainer>
    </div>
  );
};

export default Index;
