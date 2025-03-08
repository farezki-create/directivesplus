
import { useLanguage } from "@/hooks/useLanguage";

export function useQuestionOptions() {
  const { currentLanguage } = useLanguage();

  const getQuestionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
        { value: 'I dont know', label: "I don't know" }
      ];
    } else {
      return [
        { value: 'Oui', label: 'Oui' },
        { value: 'Non', label: 'Non' },
        { value: 'Je ne sais pas', label: 'Je ne sais pas' }
      ];
    }
  };

  return { getQuestionOptions };
}
