
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useState } from "react";

interface HomeHeroProps {
  onStartClick: () => void;
  onLearnMoreClick: () => void;
}

export function HomeHero({ onStartClick, onLearnMoreClick }: HomeHeroProps) {
  const { t, currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStartClick = () => {
    setIsLoading(true);
    try {
      onStartClick();
    } catch (error) {
      console.error("Error starting application:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">
        {t('homeHeroTitle')}
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8 text-center">
        {t('homeHeroDesc')}
      </p>

      <div className="flex flex-col space-y-4 max-w-lg mx-auto">
        <Button
          size="lg"
          onClick={handleStartClick}
          disabled={isLoading}
        >
          {isLoading 
            ? (currentLanguage === 'fr' ? 'Chargement...' : 'Loading...') 
            : t('startButton')}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onLearnMoreClick}
        >
          {t('learnMoreButton')}
        </Button>
      </div>
    </div>
  );
}
