
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/language/useLanguage";

interface HomeHeroProps {
  onStartClick: () => void;
  onLearnMoreClick: () => void;
}

export function HomeHero({ onStartClick, onLearnMoreClick }: HomeHeroProps) {
  const { t, currentLanguage } = useLanguage();
  
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

      <div className="flex flex-col space-y-4 max-w-lg mx-auto">
        <Button
          size="lg"
          onClick={onStartClick}
        >
          {currentLanguage === 'fr' ? 'Commencer' : 'Start'}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onLearnMoreClick}
        >
          {currentLanguage === 'fr' ? 'En savoir plus' : 'Learn more'}
        </Button>
      </div>
    </div>
  );
}
