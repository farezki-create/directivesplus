
import { useLanguage } from "@/hooks/useLanguage";
import { PDFImporter } from "@/components/import/PDFImporter";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export function FeatureHighlights() {
  const { t } = useLanguage();
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    checkAuth();
  }, []);
  
  return (
    <div className="mt-12 space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
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
      
      {userId && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <h3 className="text-lg font-semibold mb-2">{t('importExistingDirectives')}</h3>
          <PDFImporter userId={userId} />
        </div>
      )}
    </div>
  );
}
