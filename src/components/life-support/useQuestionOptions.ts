
import { useLanguage } from "@/hooks/language/useLanguage";

export function useQuestionOptions() {
  const { t, currentLanguage } = useLanguage();

  const getQuestionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'Yes', label: 'Yes' },
        { value: 'Yes for a moderate period', label: 'Yes for a moderate period' },
        { value: 'Yes only if the medical team deems it useful', label: 'Yes only if the medical team deems it useful' },
        { value: 'No quickly abandon therapeutic', label: 'No, quickly abandon therapeutic' },
        { value: 'Non-suffering is to be prioritized', label: 'Non-suffering is to be prioritized' },
        { value: 'Undecided', label: 'Undecided' }
      ];
    } else {
      return [
        { value: 'Oui', label: t('yes') },
        { value: 'Oui pour une durée modérée', label: t('yesModerateTime') },
        { value: 'Oui seulement si l\'équipe médicale le juge utile', label: t('yesMedicalTeam') },
        { value: 'Non rapidement abandonner le thérapeutique', label: t('noQuicklyAbandon') },
        { value: 'La non souffrance est à privilégier', label: t('prioritizeNoSuffering') },
        { value: 'Indécision', label: t('indecision') }
      ];
    }
  };

  return { getQuestionOptions };
}
