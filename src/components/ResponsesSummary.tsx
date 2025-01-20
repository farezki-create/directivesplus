import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ResponseSection } from "./responses/ResponseSection";
import { FreeTextInput } from "./free-text/FreeTextInput";

interface ResponsesSummaryProps {
  userId: string;
}

export function ResponsesSummary({ userId }: ResponsesSummaryProps) {
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(userId);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (hasErrors) {
    return <div>Une erreur est survenue lors du chargement des réponses.</div>;
  }

  return (
    <div className="space-y-8">
      <ResponseSection
        title="Mon avis d'une façon générale"
        responses={responses?.general || []}
      />
      <ResponseSection
        title="Maintien en vie, que pensez-vous:"
        responses={responses?.lifeSupport || []}
      />
      <ResponseSection
        title="Maladie avancée"
        responses={responses?.advancedIllness || []}
      />
      <ResponseSection
        title="Mes goûts et mes peurs"
        responses={responses?.preferences || []}
      />
      <FreeTextInput userId={userId} />
    </div>
  );
}