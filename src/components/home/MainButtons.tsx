import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
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

  return (
    <div className="grid gap-4 max-w-lg mx-auto">
      <Button
        size="lg"
        onClick={onGeneralOpinionClick}
        className="w-full"
      >
        Mon avis d'une façon générale
      </Button>
      <Button
        size="lg"
        onClick={onLifeSupportClick}
        className="w-full"
      >
        Maintien en vie
      </Button>
      <Button
        size="lg"
        onClick={onAdvancedIllnessClick}
        className="w-full"
      >
        Maladie avancée
      </Button>
      <Button
        size="lg"
        onClick={onPreferencesClick}
        className="w-full"
      >
        Mes goûts et mes peurs
      </Button>
      <Button
        size="lg"
        onClick={() => navigate("/dashboard")}
        className="w-full flex items-center justify-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Désignation d'une personne de confiance
      </Button>
    </div>
  );
}