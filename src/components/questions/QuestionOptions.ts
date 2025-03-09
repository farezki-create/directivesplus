
import { useLanguage } from "@/hooks/useLanguage";

export function useQuestionOptions() {
  const { t, currentLanguage } = useLanguage();

  const getGeneralOpinionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'i_dont_know', label: "I don't know" }
      ];
    } else {
      return [
        { value: 'oui', label: t('yes') },
        { value: 'non', label: t('no') },
        { value: 'je_ne_sais_pas', label: t('dontKnow') }
      ];
    }
  };

  const getLifeSupportOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: "I'm not sure" }
      ];
    } else {
      return [
        { value: 'oui', label: t('yes') },
        { value: 'non', label: t('no') },
        { value: 'incertain', label: t('notSure') }
      ];
    }
  };

  const getAdvancedIllnessOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'agree', label: 'I agree' },
        { value: 'disagree', label: 'I disagree' },
        { value: 'unsure', label: "I'm not sure" }
      ];
    } else {
      return [
        { value: 'oui', label: t('yes') },
        { value: 'non', label: t('no') },
        { value: 'je_ne_sais_pas', label: t('dontKnow') }
      ];
    }
  };

  const getPreferencesOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'important', label: 'Important to me' },
        { value: 'not_important', label: 'Not important to me' }
      ];
    } else {
      return [
        { value: 'important', label: t('importantToMe') },
        { value: 'pas_important', label: t('notImportantToMe') }
      ];
    }
  };

  return {
    getGeneralOpinionOptions,
    getLifeSupportOptions,
    getAdvancedIllnessOptions,
    getPreferencesOptions
  };
}
