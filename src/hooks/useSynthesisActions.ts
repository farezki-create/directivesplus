
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";
import { saveDirectivesWithDualStorage } from "@/utils/directives/directivesStorage";

/**
 * Hook pour gérer les actions de synthèse des directives
 */
export const useSynthesisActions = (userId?: string) => {
  const { user, profile } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);

  /**
   * Fonction pour sauvegarder et générer le PDF des directives
   */
  const handleSaveAndGeneratePDF = async (freeText: string, data: any) => {
    if (!user && !userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos directives",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      // Vérifier si les données sont valides
      if (!data) {
        throw new Error("Données de directives manquantes");
      }

      // Générer le PDF avec les données et le chemin de sauvegarde
      let pdfOutput;
      try {
        pdfOutput = await generatePDF({
          ...data,
          freeText,
          signature,
        });
      } catch (pdfError: any) {
        console.error("Erreur lors de la génération du PDF:", pdfError);
        throw new Error("Impossible de générer le PDF: " + (pdfError.message || "Erreur inconnue"));
      }

      // Vérifier si le PDF a été généré correctement
      if (!pdfOutput) {
        throw new Error("Le PDF n'a pas pu être généré correctement");
      }

      // Utiliser notre fonction de double enregistrement
      const result = await saveDirectivesWithDualStorage({
        userId: userId || user?.id || "",
        pdfOutput,
        description: "Directives anticipées générées le " + new Date().toLocaleDateString('fr-FR'),
        profileData: profile || data.profileData
      });

      if (result.success) {
        toast({
          title: "Directives enregistrées",
          description: "Vos directives anticipées ont été sauvegardées avec succès et sont accessibles via votre code d'accès",
        });
        return result.documentId;
      } else {
        // Si l'erreur est liée à l'accès avec RLS, on informe mais considère comme réussi
        if (result.error?.includes("row-level security policy")) {
          toast({
            title: "Directives partiellement enregistrées",
            description: "Vos directives ont été sauvegardées dans votre bibliothèque personnelle mais ne sont pas accessibles via code d'accès.",
          });
          return result.documentId;
        }
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde des directives:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'enregistrement",
        variant: "destructive",
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
