import { useState } from "react";
import { PDFGenerator } from "@/components/PDFGenerator";
import { Button } from "@/components/ui/button";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ResponseSection } from "./responses/ResponseSection";
import { FreeTextInput } from "./free-text/FreeTextInput";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { usePDFData } from "./pdf/usePDFData";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface ResponsesSummaryProps {
  userId: string;
}

export function ResponsesSummary({
  userId
}: ResponsesSummaryProps) {
  const {
    responses,
    isLoading,
    hasErrors
  } = useQuestionnairesResponses(userId);
  const {
    profile,
    loading: profileLoading
  } = usePDFData();
  const {
    toast
  } = useToast();
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
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
  console.log("[ResponsesSummary] Profile data:", profile);
  console.log("[ResponsesSummary] Showing PDF Generator:", showPDFGenerator);

  if (isLoading || profileLoading) {
    return <div className="p-4 text-center">Chargement de vos réponses...</div>;
  }

  if (hasErrors) {
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors du chargement des réponses.",
      variant: "destructive"
    });
    return <div className="p-4 text-center text-red-500">Une erreur est survenue lors du chargement des réponses.</div>;
  }

  if (!userId) {
    console.error("[ResponsesSummary] No user ID provided");
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non renseignée';
    try {
      const dateObj = parseISO(dateString);
      if (isValid(dateObj)) {
        return format(dateObj, "d MMMM yyyy", {
          locale: fr
        });
      }
      return 'Non renseignée';
    } catch (error) {
      console.error("[ResponsesSummary] Error formatting date:", error);
      return 'Non renseignée';
    }
  };

  const formatAddress = () => {
    if (!profile) return 'Non renseignée';
    const addressParts = [];
    if (profile.address) addressParts.push(profile.address);
    const cityLine = [profile.postal_code, profile.city].filter(Boolean).join(" ");
    if (cityLine) addressParts.push(cityLine);
    if (profile.country) addressParts.push(profile.country);
    return addressParts.length > 0 ? addressParts.join(', ') : 'Non renseignée';
  };

  const renderProfileInfo = () => {
    if (!profile) return null;
    return <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-medium mb-3">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <span className="font-semibold">Nom :</span> {profile.last_name || 'Non renseigné'}
          </div>
          <div>
            <span className="font-semibold">Prénom :</span> {profile.first_name || 'Non renseigné'}
          </div>
          <div>
            <span className="font-semibold">Date de naissance :</span> {formatDate(profile.birth_date)}
          </div>
          <div>
            <span className="font-semibold">Adresse :</span> {formatAddress()}
          </div>
        </div>
      </div>;
  };

  return <div className="space-y-8">
      {renderProfileInfo()}
      
      <ResponseSection title={t('generalOpinion')} responses={responses?.general || []} />
      <ResponseSection title={t('lifeSupport')} responses={responses?.lifeSupport || []} />
      <ResponseSection title={t('advancedIllnessTitle')} responses={responses?.advancedIllness || []} />
      <ResponseSection title={t('preferences')} responses={responses?.preferences || []} />
      
      <FreeTextInput userId={userId} onSaveComplete={handleSaveComplete} onSignComplete={handleSignComplete} />
      
      {showPDFGenerator && <div className="mt-8 p-4 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-medium mb-4">Générer votre document</h3>
          <PDFGenerator userId={userId} />
        </div>}
    </div>;
}
