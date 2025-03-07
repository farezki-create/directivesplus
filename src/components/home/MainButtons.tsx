
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useEffect } from "react";

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
  const { t } = useLanguage();

  useEffect(() => {
    console.log("[MainButtons] Component mounted with handlers ready");
  }, []);

  const handleGeneralOpinionClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default form submission
    console.log("[MainButtons] General Opinion button clicked");
    
    if (typeof onGeneralOpinionClick === 'function') {
      console.log("[MainButtons] Calling onGeneralOpinionClick function");
      onGeneralOpinionClick();
    } else {
      console.error("[MainButtons] onGeneralOpinionClick is not a function");
    }
  };

  const navigateToTrustedPersons = () => {
    navigate("/dashboard?tab=persons");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
      <Button 
        onClick={handleGeneralOpinionClick} 
        size="lg"
        type="button"
      >
        {t('generalOpinion')}
      </Button>
      <Button 
        onClick={onLifeSupportClick} 
        size="lg"
        type="button"
      >
        {t('lifeSupport')}
      </Button>
      <Button 
        onClick={onAdvancedIllnessClick} 
        size="lg"
        type="button"
      >
        {t('advancedIllnessTitle')}
      </Button>
      <Button 
        onClick={onPreferencesClick} 
        size="lg"
        type="button"
      >
        {t('preferences')}
      </Button>
      <Button 
        onClick={navigateToTrustedPersons} 
        size="lg"
        type="button"
      >
        {t('trustedPerson')}
      </Button>
      <Button 
        onClick={() => navigate("/examples")} 
        size="lg"
        type="button"
      >
        {t('examples')}
      </Button>
      <Button 
        onClick={() => navigate("/free-text")} 
        size="lg"
        className="md:col-span-2"
        type="button"
      >
        {t('summary')}
      </Button>
    </div>
  );
}
