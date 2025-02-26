
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

export function TemplatesList() {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">{t('moreTherapeuticCare')}</h3>
          <p className="text-sm text-gray-600">
            {t('moreTherapeuticCareDesc')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">{t('morePainRelief')}</h3>
          <p className="text-sm text-gray-600">
            {t('morePainReliefDesc')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">{t('intermediate')}</h3>
          <p className="text-sm text-gray-600">
            {t('intermediateDesc')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
