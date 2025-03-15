
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
    console.log(`Getting life support options for language: ${currentLanguage}`);
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'unsure', label: "I'm not sure" }
      ];
    } else {
      const options = [
        { value: 'oui', label: t('yes') },
        { value: 'non', label: t('no') },
        { value: 'je_ne_sais_pas', label: t('dontKnow') }
      ];
      console.log('French life support options:', options);
      return options;
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

  return {
    getGeneralOpinionOptions,
    getLifeSupportOptions,
    getAdvancedIllnessOptions,
    getPreferencesOptions
  };
}
