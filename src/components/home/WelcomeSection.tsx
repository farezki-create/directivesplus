
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import { MainButtons } from "./MainButtons";

interface WelcomeSectionProps {
  onShowMoreInfo: () => void;
  onGeneralOpinionClick: () => void;
  onLifeSupportClick: () => void;
  onAdvancedIllnessClick: () => void;
  onPreferencesClick: () => void;
  showWritingSection?: boolean;
}

export function WelcomeSection({
  onShowMoreInfo,
  onGeneralOpinionClick,
  onLifeSupportClick,
  onAdvancedIllnessClick,
  onPreferencesClick,
  showWritingSection = false
}: WelcomeSectionProps) {
  const { currentLanguage } = useLanguage();
  const [showSections, setShowSections] = useState(false);

  // Set showSections to true if showWritingSection prop is true
  useEffect(() => {
    if (showWritingSection) {
      setShowSections(true);
    }
  }, [showWritingSection]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-blue-600 mb-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {currentLanguage === 'fr' 
            ? 'Vos directives anticipées en toute simplicité' 
            : 'Your advance directives with simplicity'}
        </h1>
      </div>
      
      <p className="text-xl text-muted-foreground mb-8 text-center">
        {currentLanguage === 'fr' 
          ? 'Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.' 
          : 'Write your advance directives and designate your trusted persons in a few simple and secure steps.'}
      </p>

      {!showSections ? (
        <div className="flex flex-col space-y-4 max-w-lg mx-auto">
          <Button
            size="lg"
            onClick={() => setShowSections(true)}
          >
            {currentLanguage === 'fr' ? 'Commencer' : 'Start'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onShowMoreInfo}
          >
            {currentLanguage === 'fr' ? 'En savoir plus' : 'Learn more'}
          </Button>
        </div>
      ) : (
        <MainButtons 
          onGeneralOpinionClick={onGeneralOpinionClick}
          onLifeSupportClick={onLifeSupportClick}
          onAdvancedIllnessClick={onAdvancedIllnessClick}
          onPreferencesClick={onPreferencesClick}
        />
      )}
    </div>
  );
}
