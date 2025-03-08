
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { MainButtons } from "@/components/home/MainButtons";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";

interface HomeContentProps {
  onShowMoreInfo: () => void;
  onGeneralOpinionClick: () => void;
  onLifeSupportClick: () => void;
  onAdvancedIllnessClick: () => void;
  onPreferencesClick: () => void;
}

export function HomeContent({
  onShowMoreInfo,
  onGeneralOpinionClick,
  onLifeSupportClick,
  onAdvancedIllnessClick,
  onPreferencesClick,
}: HomeContentProps) {
  const [showSections, setShowSections] = useState(false);
  const { currentLanguage } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">
        {currentLanguage === 'fr' 
          ? 'Vos directives anticipées en toute simplicité' 
          : 'Your advance directives with simplicity'}
      </h1>
      
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

      <FeatureHighlights />
    </div>
  );
}
