
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";
import { saveDirectivesWithDualStorage } from "@/utils/directives/directivesStorage";
import { useNavigate } from "react-router-dom";

/**
 * Hook pour gérer les actions de synthèse des directives
 */
export const useSynthesisActions = (userId?: string) => {
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSaveAndGeneratePDF = async (freeText: string, data: any) => {
    if (!user && !userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos directives",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    try {
      setSaving(true);

      if (!data) {
        throw new Error("Données de directives manquantes");
      }

      const pdfData = {
        profileData: data.profileData,
        responses: data.responses || {},
        examplePhrases: data.examplePhrases || [],
        customPhrases: data.customPhrases || [],
        trustedPersons: data.trustedPersons || [],
        freeText: freeText || "",
        signature,
        userId: userId || user?.id,
      };

      let pdfOutput;
      try {
        pdfOutput = await generatePDF(pdfData);
      } catch (pdfError: any) {
        console.error("Erreur lors de la génération du PDF:", pdfError);
        throw new Error("Impossible de générer le PDF: " + (pdfError.message || "Erreur inconnue"));
      }

      if (!pdfOutput) {
        throw new Error("Le PDF n'a pas pu être généré correctement");
      }

      const result = await saveDirectivesWithDualStorage({
        userId: userId || user?.id || "",
        pdfOutput,
        description: "Directives anticipées générées le " + new Date().toLocaleDateString('fr-FR'),
        profileData: profile || data.profileData,
        redirectToViewer: true
      });

      if (result.success) {
        toast({
          title: "Directives enregistrées",
          description: "Vos directives anticipées ont été sauvegardées avec succès",
          duration: 2000
        });
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (result.accessCode) {
          sessionStorage.setItem('directAccessCode', result.accessCode);
          navigate('/mes-directives', { replace: true });
          return result.documentId; 
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde des directives:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'enregistrement",
        variant: "destructive",
        duration: 2000
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    signature,
    setSignature,
    handleSaveAndGeneratePDF,
  };
};
