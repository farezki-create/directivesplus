
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

  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
      <Button 
        onClick={onGeneralOpinionClick} 
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
        onClick={() => navigate("/dashboard?tab=persons")} 
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
