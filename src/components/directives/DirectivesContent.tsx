
import { ResponseSection } from "@/components/responses/ResponseSection";
import { useLanguage } from "@/hooks/useLanguage";
import { FreeTextInput } from "@/components/free-text/FreeTextInput";

interface DirectivesContentProps {
  userId: string;
  responses: any;
  onSaveComplete: () => void;
  onSignComplete: () => void;
}

export function DirectivesContent({ 
  userId, 
  responses, 
  onSaveComplete, 
  onSignComplete 
}: DirectivesContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <ResponseSection
        title={t('generalOpinion')}
        responses={responses?.general || []}
      />
      <ResponseSection
        title={t('lifeSupport')}
        responses={responses?.lifeSupport || []}
      />
      <ResponseSection
        title={t('advancedIllnessTitle')}
        responses={responses?.advancedIllness || []}
      />
      <ResponseSection
        title={t('preferences')}
        responses={responses?.preferences || []}
      />
      
      <FreeTextInput 
        userId={userId} 
        onSaveComplete={onSaveComplete}
        onSignComplete={onSignComplete}
      />
    </div>
  );
}
