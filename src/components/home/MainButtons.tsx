
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
        onClick={() => navigate("/examples")} 
        size="lg"
      >
        {t('phrasesTitle')}
      </Button>
      <Button 
        onClick={() => navigate("/free-text")} 
        size="lg"
        className="md:col-span-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
      >
        {t('summary')}
      </Button>
    </div>
  );
}
