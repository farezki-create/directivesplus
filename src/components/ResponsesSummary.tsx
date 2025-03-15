
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { useToast } from "@/hooks/use-toast";
import { usePDFData } from "./pdf/usePDFData";
import { ProfileSection } from "./profile/ProfileSection";
import { DirectivesContent } from "./directives/DirectivesContent";
import { PDFGenerationSection } from "./pdf/PDFGenerationSection";

interface ResponsesSummaryProps {
  userId: string;
}

export function ResponsesSummary({ userId }: ResponsesSummaryProps) {
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(userId);
  const { profile, loading: profileLoading } = usePDFData();
  const { toast } = useToast();
  const [hasSaved, setHasSaved] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [showPDFGenerator, setShowPDFGenerator] = useState(false);

  const handleSaveComplete = () => {
    setHasSaved(true);
  };

  const handleSignComplete = () => {
    setHasSigned(true);
    setShowPDFGenerator(true);
  };

  console.log("[ResponsesSummary] User ID:", userId);
  console.log("[ResponsesSummary] Responses:", responses);

  if (isLoading || profileLoading) {
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
      <ProfileSection profile={profile} loading={profileLoading} />
      
      <DirectivesContent 
        userId={userId} 
        responses={responses}
        onSaveComplete={handleSaveComplete}
        onSignComplete={handleSignComplete}
      />
      
      <PDFGenerationSection 
        userId={userId} 
        isVisible={showPDFGenerator}
      />
    </div>
  );
}
