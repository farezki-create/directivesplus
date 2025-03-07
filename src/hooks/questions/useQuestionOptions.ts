
import { useLanguage } from "@/hooks/language/useLanguage";

export function useQuestionOptions() {
  const { currentLanguage } = useLanguage();

  const getQuestionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ];
    } else {
      return [
        { value: 'oui', label: 'OUI' },
        { value: 'non', label: 'NON' }
      ];
    }
  };

  return { getQuestionOptions };
}
