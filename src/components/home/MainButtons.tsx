
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

export function MainButtons() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGeneralOpinionClick = () => {
    navigate("/general-opinion");
  };

  const handleLifeSupportClick = () => {
    navigate("/life-support");
  };

  const handleAdvancedIllnessClick = () => {
    navigate("/advanced-illness");
  };

  const handlePreferencesClick = () => {
    navigate("/preferences");
  };

  const navigateToTrustedPersons = () => {
    navigate("/dashboard?tab=persons");
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
