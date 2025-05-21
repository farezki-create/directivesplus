
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

      // Générer le PDF avec les données
      const pdfOutput = await generatePDF({
        ...data,
        freeText,
        signature,
      });

      // Utiliser notre nouvelle fonction de double enregistrement
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
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde des directives:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'enregistrement",
        variant: "destructive",
      });
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
