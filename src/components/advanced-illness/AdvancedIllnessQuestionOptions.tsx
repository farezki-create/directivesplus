
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

export function useAdvancedIllnessQuestionOptions() {
  const { t, currentLanguage } = useLanguage();

  const getQuestionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'yes_medical', label: 'Yes if the medical team deems it useful' },
        { value: 'yes_trusted', label: 'Yes if my trusted person deems it useful' }
      ];
    } else {
      return [
        { value: 'oui', label: t('yes') },
        { value: 'non', label: t('no') },
        { value: 'oui_medical', label: t('yesMedicalTeam') },
        { value: 'oui_confiance', label: t('yesTrustedPerson') }
      ];
    }
  };

  return { getQuestionOptions };
}
