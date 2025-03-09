
import { useLanguage } from "@/hooks/useLanguage";

export interface QuestionOption {
  value: string;
  label: string;
}

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
  
  const getLifeSupportOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'undecided', label: "I don't know" }
      ];
    } else {
      return [
        { value: 'oui', label: 'Oui' },
        { value: 'non', label: 'Non' },
        { value: 'indecis', label: 'Je ne sais pas' }
      ];
    }
  };
  
  const getAdvancedIllnessOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'undecided', label: "I don't know" }
      ];
    } else {
      return [
        { value: 'oui', label: 'Oui' },
        { value: 'non', label: 'Non' },
        { value: 'je_ne_sais_pas', label: 'Je ne sais pas' }
      ];
    }
  };
  
  const getPreferencesOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: "yes", label: 'Yes' },
        { value: "no", label: 'No' },
        { value: "undecided", label: "I don't know" }
      ];
    } else {
      return [
        { value: "oui", label: 'Oui' },
        { value: "non", label: 'Non' },
        { value: "indecis", label: 'Je ne sais pas' }
      ];
    }
  };

  return { 
    getQuestionOptions,
    getLifeSupportOptions,
    getAdvancedIllnessOptions,
    getPreferencesOptions
  };
}
