
import { FC, useState } from "react";
import { Header } from "@/components/Header";
import { MainButtons } from "@/components/home/MainButtons";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { HomeHero } from "@/components/home/HomeHero";
import { AdditionalInfo } from "@/components/home/AdditionalInfo";
import { HomeDialogs } from "@/components/home/HomeDialogs";
import { useHomeDialogs } from "@/hooks/useHomeDialogs";
import { useToast } from "@/hooks/use-toast";

const Index: FC = () => {
  const [showSections, setShowSections] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const { handlers } = useHomeDialogs();
  const { toast } = useToast();

  const handleStartClick = () => {
    try {
      setShowSections(true);
    } catch (error) {
      console.error("Error showing sections:", error);
      toast({
        title: "Error",
        description: "An error occurred while loading the sections.",
        variant: "destructive",
      });
    }
  };

  const handleLearnMore = () => {
    try {
      setShowMoreInfo(true);
    } catch (error) {
      console.error("Error showing more info:", error);
      toast({
        title: "Error",
        description: "An error occurred while loading additional information.",
        variant: "destructive",
      });
    }
  };

  const handleBackToHome = () => {
    try {
      setShowMoreInfo(false);
    } catch (error) {
      console.error("Error returning to home:", error);
      toast({
        title: "Error",
        description: "An error occurred while returning to the home page.",
        variant: "destructive",
      });
    }
  };

  if (showMoreInfo) {
    return <AdditionalInfo onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!showSections ? (
          <HomeHero 
            onStartClick={handleStartClick}
            onLearnMoreClick={handleLearnMore}
          />
        ) : (
          <MainButtons 
            onGeneralOpinionClick={handlers.handleGeneralOpinionClick}
            onLifeSupportClick={handlers.handleLifeSupportClick}
            onAdvancedIllnessClick={handlers.handleAdvancedIllnessClick}
            onPreferencesClick={handlers.handlePreferencesClick}
          />
        )}

        <FeatureHighlights />
      </main>

      <HomeDialogs />
    </div>
  );
};

export default Index;
