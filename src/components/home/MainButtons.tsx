
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

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

  const navigateToTrustedPersons = () => {
    navigate("/dashboard?tab=persons");
  };

  const handleGeneralOpinionClick = () => {
    console.log("General opinion button clicked");
    if (onGeneralOpinionClick) onGeneralOpinionClick();
  };

  const handleLifeSupportClick = () => {
    console.log("Life support button clicked");
    if (onLifeSupportClick) onLifeSupportClick();
  };

  const handleAdvancedIllnessClick = () => {
    console.log("Advanced illness button clicked");
    if (onAdvancedIllnessClick) onAdvancedIllnessClick();
  };

  const handlePreferencesClick = () => {
    console.log("Preferences button clicked");
    if (onPreferencesClick) onPreferencesClick();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
      <Button onClick={handleGeneralOpinionClick} size="lg">
        {t('generalOpinion')}
      </Button>
      <Button onClick={handleLifeSupportClick} size="lg">
        {t('lifeSupport')}
      </Button>
      <Button onClick={handleAdvancedIllnessClick} size="lg">
        {t('advancedIllnessTitle')}
      </Button>
      <Button onClick={handlePreferencesClick} size="lg">
        {t('preferences')}
      </Button>
      <Button onClick={navigateToTrustedPersons} size="lg">
        {t('trustedPerson')}
      </Button>
      <Button 
        onClick={() => navigate("/free-text")} 
        size="lg"
      >
        {t('summary')}
      </Button>
      <Button 
        onClick={() => navigate("/examples")} 
        size="lg"
        className="md:col-span-2"
      >
        {t('examples')}
      </Button>
    </div>
  );
}
