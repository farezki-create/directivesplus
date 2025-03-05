
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client"; 
import { useToast } from "@/hooks/use-toast";

interface AdditionalInfoProps {
  onBackToHome: () => void;
}

export function AdditionalInfo({ onBackToHome }: AdditionalInfoProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetImageUrl = async () => {
    try {
      setIsLoading(true);
      
      // The error is properly handled by the catch block
      const { data } = await supabase
        .storage
        .from('public')
        .getPublicUrl('additional-info.jpg');
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error fetching image:', error);
      toast({
        title: t('error'),
        description: "Failed to load additional information image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{t('about')}</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">{t('featureHighlightsTitle')}</h2>
        
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-medium">{t('simpleAndGuided')}</h3>
            <p>{t('stepByStepProcess')}</p>
          </section>
          
          <section>
            <h3 className="text-lg font-medium">{t('fullSecure')}</h3>
            <p>{t('dataSecurelyStored')}</p>
          </section>
          
          <section>
            <h3 className="text-lg font-medium">{t('examples')}</h3>
            <p>Nous proposons des exemples de formulations pour vous aider à exprimer vos souhaits.</p>
          </section>
        </div>
      </div>
      
      <div className="mt-8">
        <Button 
          onClick={onBackToHome} 
          variant="default"
          className="mt-4"
          disabled={isLoading}
        >
          {isLoading ? t('loading') : t('back')}
        </Button>
      </div>
    </div>
  );
}
