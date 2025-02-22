
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ResponseSection } from "./responses/ResponseSection";
import { FreeTextInput } from "./free-text/FreeTextInput";
import { useToast } from "@/hooks/use-toast";

interface ResponsesSummaryProps {
  userId: string;
}

export function ResponsesSummary({ userId }: ResponsesSummaryProps) {
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(userId);
  const { toast } = useToast();

  console.log("[ResponsesSummary] User ID:", userId);
  console.log("[ResponsesSummary] Responses:", responses);

  if (isLoading) {
    return <div className="p-4 text-center">Chargement de vos réponses...</div>;
  }

  if (hasErrors) {
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors du chargement des réponses.",
      variant: "destructive",
    });
    return <div className="p-4 text-center text-red-500">Une erreur est survenue lors du chargement des réponses.</div>;
  }

  if (!userId) {
    console.error("[ResponsesSummary] No user ID provided");
    return null;
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
