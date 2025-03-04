
import { useLanguage } from "@/hooks/useLanguage";

export function FeatureHighlights() {
  const { t } = useLanguage();
  
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-2">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{t('simpleAndGuided')}</h3>
        <p className="text-muted-foreground">
          {t('stepByStepProcess')}
        </p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{t('100Secure')}</h3>
        <p className="text-muted-foreground">
          {t('dataSecurelyStored')}
        </p>
      </div>
    </div>
  );
}
