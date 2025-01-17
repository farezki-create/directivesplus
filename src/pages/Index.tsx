import { useState } from "react";
import { Header } from "@/components/Header";
import { useDialogState } from "@/hooks/useDialogState";
import { MainButtons } from "@/components/home/MainButtons";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { DialogManager } from "@/components/home/DialogManager";
import { HomeHeader } from "@/components/home/HomeHeader";
import { InitialButtons } from "@/components/home/InitialButtons";

const Index = () => {
  const [showSections, setShowSections] = useState(false);
  const dialogState = useDialogState();

  const handleGeneralOpinionClick = () => {
    console.log("[Index] Opening general opinion dialog");
    dialogState.setExplanationOpen(true);
  };

  const handleLifeSupportClick = () => {
    console.log("[Index] Opening life support dialog");
    dialogState.setLifeSupportExplanationOpen(true);
  };

  const handleAdvancedIllnessClick = () => {
    console.log("[Index] Opening advanced illness dialog");
    dialogState.setAdvancedIllnessExplanationOpen(true);
  };

  const handlePreferencesClick = () => {
    console.log("[Index] Opening preferences dialog");
    dialogState.setPreferencesExplanationOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <HomeHeader />

          {!showSections ? (
            <InitialButtons onStart={() => setShowSections(true)} />
          ) : (
            <>
              <MainButtons 
                onGeneralOpinionClick={handleGeneralOpinionClick}
                onLifeSupportClick={handleLifeSupportClick}
                onAdvancedIllnessClick={handleAdvancedIllnessClick}
                onPreferencesClick={handlePreferencesClick}
              />
              <DialogManager />
            </>
          )}

          <FeatureHighlights />
        </div>
      </main>
      <DialogManager />
    </div>
  );
};

export default Index;