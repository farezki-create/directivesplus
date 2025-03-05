
import * as React from "react";
import { InfoIcon } from "lucide-react";
import { useLanguage } from "@/hooks/language/useLanguage";

export const NotificationMessage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200 flex items-start gap-3">
      <InfoIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">{t('productSoonAvailable')}</p>
        <p className="text-sm mt-1">
          {t('productNotAvailableYet')}
        </p>
      </div>
    </div>
  );
};
