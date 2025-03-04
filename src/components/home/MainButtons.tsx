
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { ButtonItem } from "./ButtonItem";
import { ButtonCategory } from "./ButtonCategory";

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
    <div className="max-w-2xl mx-auto mb-8">
      <ButtonCategory>
        <ButtonItem 
          onClick={onGeneralOpinionClick} 
          label={t('generalOpinion')} 
        />
        <ButtonItem 
          onClick={onLifeSupportClick} 
          label={t('lifeSupport')} 
        />
        <ButtonItem 
          onClick={onAdvancedIllnessClick} 
          label={t('advancedIllnessTitle')} 
        />
        <ButtonItem 
          onClick={onPreferencesClick} 
          label={t('preferences')} 
        />
        <ButtonItem 
          onClick={navigateToTrustedPersons} 
          label={t('trustedPerson')} 
        />
        <ButtonItem 
          onClick={() => navigate("/free-text")} 
          label={t('summary')} 
        />
        <ButtonItem 
          onClick={() => navigate("/examples")} 
          label={t('examples')} 
          className="md:col-span-2"
        />
      </ButtonCategory>
    </div>
  );
}
