import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MainButtonsProps {
  onGeneralOpinionClick: () => void;
  onLifeSupportClick: () => void;
  onAdvancedIllnessClick: () => void;
  onPreferencesClick: () => void;
}

export function MainButtons({
  onGeneralOpinionClick,
  onLifeSupportClick,
  onAdvancedIllnessClick,
  onPreferencesClick,
}: MainButtonsProps) {
  const navigate = useNavigate();

  const navigateToTrustedPersons = () => {
    navigate("/dashboard?tab=persons");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
      <Button onClick={onGeneralOpinionClick} size="lg">
        Mon avis général
      </Button>
      <Button onClick={onLifeSupportClick} size="lg">
        Maintien de la vie
      </Button>
      <Button onClick={onAdvancedIllnessClick} size="lg">
        Maladie avancée
      </Button>
      <Button onClick={onPreferencesClick} size="lg">
        Mes goûts et mes peurs
      </Button>
      <Button onClick={navigateToTrustedPersons} size="lg">
        Désignation de la personne de confiance
      </Button>
      <Button 
        onClick={() => navigate("/free-text")} 
        size="lg"
      >
        Synthèse du questionnaire
      </Button>
    </div>
  );
}