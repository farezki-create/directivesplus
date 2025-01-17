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

  const handleGeneralOpinionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("[MainButtons] Clicking general opinion button");
    onGeneralOpinionClick();
  };

  const handleLifeSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("[MainButtons] Clicking life support button");
    onLifeSupportClick();
  };

  const handleAdvancedIllnessClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("[MainButtons] Clicking advanced illness button");
    onAdvancedIllnessClick();
  };

  const handlePreferencesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("[MainButtons] Clicking preferences button");
    onPreferencesClick();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
      <Button onClick={handleGeneralOpinionClick} size="lg">
        Mon avis général
      </Button>
      <Button onClick={handleLifeSupportClick} size="lg">
        Maintien de la vie
      </Button>
      <Button onClick={handleAdvancedIllnessClick} size="lg">
        Maladie avancée
      </Button>
      <Button onClick={handlePreferencesClick} size="lg">
        Mes goûts et mes peurs
      </Button>
      <Button onClick={() => navigate("/dashboard?tab=persons")} size="lg">
        Désignation de la personne de confiance
      </Button>
      <Button 
        onClick={() => navigate("/free-text")} 
        size="lg"
      >
        Synthèse du questionnaire
      </Button>
      <Button 
        onClick={() => navigate("/examples")} 
        size="lg"
        className="md:col-span-2"
      >
        Exemples et documents utiles
      </Button>
    </div>
  );
}