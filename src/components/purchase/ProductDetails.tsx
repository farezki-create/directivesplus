
import { useLanguage } from "@/hooks/language/useLanguage";

export const ProductDetails = () => {
  const { t } = useLanguage();
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="h-[400px] bg-white relative rounded-lg overflow-hidden">
        <img 
          src="/lovable-uploads/6bb21b02-63a3-4da2-8feb-a4ec9237c2bf.png"
          alt={t('usbMemoryCardAlt')}
          className="object-contain w-full h-full"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium">{t('features')}</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>{t('creditCardFormat')}</li>
            <li>{t('usbConnector')}</li>
            <li>{t('storageCapacity')}</li>
            <li>{t('secureStorage')}</li>
            <li>{t('universalCompatibility')}</li>
          </ul>
        </div>

        <div className="p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
          <p className="font-medium">
            {t('usbMemoryCardNotAvailable')}
          </p>
        </div>
      </div>
    </div>
  );
};
