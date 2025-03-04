
import { useLanguage } from "@/hooks/useLanguage";

export function useQuestionOptions() {
  const { t, currentLanguage } = useLanguage();

  const getQuestionOptions = () => {
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
        { value: 'je_ne_sais_pas', label: t('iDontKnow') }
      ];
    }
  };

  return { getQuestionOptions };
}
