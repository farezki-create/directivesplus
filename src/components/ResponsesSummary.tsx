
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ResponseSection } from "./responses/ResponseSection";
import { FreeTextInput } from "./free-text/FreeTextInput";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";

interface ResponsesSummaryProps {
  userId: string;
}

export function ResponsesSummary({ userId }: ResponsesSummaryProps) {
  const { responses, isLoading, hasErrors } = useQuestionnairesResponses(userId);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isImported, setIsImported] = useState(false);

  console.log("[ResponsesSummary] User ID:", userId);
  console.log("[ResponsesSummary] Responses:", responses);

  useEffect(() => {
    // Check if content is imported based on the free text content
    if (responses?.synthesis?.free_text) {
      const importedContent = responses.synthesis.free_text.includes('DIRECTIVES ANTICIPÉES IMPORTÉES') ||
                             responses.synthesis.free_text.includes('DOCUMENT IMPORTÉ');
      setIsImported(importedContent);
    }
  }, [responses]);

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

  // Process imported content
  const importedResponses = isImported && responses?.synthesis?.free_text ? extractImportedData(responses.synthesis.free_text) : null;

  return (
    <div className="space-y-8">
      {isImported && importedResponses ? (
        <>
          <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50 rounded mb-8">
            <p className="font-semibold text-amber-700">Document importé</p>
            <p className="text-sm text-amber-600">Ce document a été importé depuis un PDF. Vous pouvez éditer le contenu dans la zone de texte ci-dessous.</p>
          </div>
          
          {importedResponses.general.length > 0 && (
            <ResponseSection
              title={t('generalOpinion')}
              responses={importedResponses.general}
              isImported={true}
            />
          )}
          
          {importedResponses.lifeSupport.length > 0 && (
            <ResponseSection
              title={t('lifeSupport')}
              responses={importedResponses.lifeSupport}
              isImported={true}
            />
          )}
          
          {importedResponses.advancedIllness.length > 0 && (
            <ResponseSection
              title={t('advancedIllnessTitle')}
              responses={importedResponses.advancedIllness}
              isImported={true}
            />
          )}
          
          {importedResponses.preferences.length > 0 && (
            <ResponseSection
              title={t('preferences')}
              responses={importedResponses.preferences}
              isImported={true}
            />
          )}
        </>
      ) : (
        <>
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
        </>
      )}
      <FreeTextInput userId={userId} />
    </div>
  );
}

// Helper function to extract structured data from imported text
function extractImportedData(text: string) {
  const sections = {
    general: [],
    lifeSupport: [],
    advancedIllness: [],
    preferences: []
  };
  
  // Extract sections from the imported text
  const generalMatch = text.match(/Mon avis d'une façon générale\n(.*?)(?=\n\n|$)/s);
  const lifeSupportMatch = text.match(/Maintien en vie\n(.*?)(?=\n\n|$)/s);
  const advancedIllnessMatch = text.match(/Maladie avancée\n(.*?)(?=\n\n|$)/s);
  const preferencesMatch = text.match(/Mes goûts et mes peurs\n(.*?)(?=\n\n|$)/s);
  
  // Create response objects for each section
  if (generalMatch && generalMatch[1].trim()) {
    sections.general.push({
      question_text: "Mon avis d'une façon générale",
      response: generalMatch[1].trim()
    });
  }
  
  if (lifeSupportMatch && lifeSupportMatch[1].trim()) {
    sections.lifeSupport.push({
      question_text: "Maintien en vie",
      response: lifeSupportMatch[1].trim()
    });
  }
  
  if (advancedIllnessMatch && advancedIllnessMatch[1].trim()) {
    sections.advancedIllness.push({
      question_text: "Maladie avancée",
      response: advancedIllnessMatch[1].trim()
    });
  }
  
  if (preferencesMatch && preferencesMatch[1].trim()) {
    sections.preferences.push({
      question_text: "Mes goûts et mes peurs",
      response: preferencesMatch[1].trim()
    });
  }
  
  return sections;
}
