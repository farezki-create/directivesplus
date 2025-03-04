
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/language/useLanguage";

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

  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
      <Button onClick={onGeneralOpinionClick} size="lg">
        {t('generalOpinion')}
      </Button>
      <Button onClick={onLifeSupportClick} size="lg">
        {t('lifeSupport')}
      </Button>
      <Button onClick={onAdvancedIllnessClick} size="lg">
        {t('advancedIllnessTitle')}
      </Button>
      <Button onClick={onPreferencesClick} size="lg">
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
