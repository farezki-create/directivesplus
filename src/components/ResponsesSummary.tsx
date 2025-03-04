
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ResponseSection } from "./responses/ResponseSection";
import { FreeTextInput } from "./free-text/FreeTextInput";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

interface ResponsesSummaryProps {
  userId: string;
}

export function ResponsesSummary({ userId }: ResponsesSummaryProps) {
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(userId);
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  console.log("[ResponsesSummary] User ID:", userId);
  console.log("[ResponsesSummary] Responses:", responses);

  if (isLoading) {
    return <div className="p-4 text-center">{currentLanguage === 'fr' ? 'Chargement de vos réponses...' : 'Loading your responses...'}</div>;
  }

  if (hasErrors) {
    toast({
      title: currentLanguage === 'fr' ? "Erreur" : "Error",
      description: currentLanguage === 'fr' 
        ? "Une erreur est survenue lors du chargement des réponses." 
        : "An error occurred while loading responses.",
      variant: "destructive",
    });
    return <div className="p-4 text-center text-red-500">
      {currentLanguage === 'fr' 
        ? "Une erreur est survenue lors du chargement des réponses." 
        : "An error occurred while loading responses."}
    </div>;
  }

  if (!userId) {
    console.error("[ResponsesSummary] No user ID provided");
    return null;
  }

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
      <FreeTextInput userId={userId} />
    </div>
  );
}
