
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";
import { useSignature } from "@/hooks/useSignature";

export const useSynthesisActions = (userId?: string) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { signature, setSignature, saveSignature } = useSignature(userId);

  const handleSaveAndGeneratePDF = async (
    freeText: string,
    data: {
      profileData: any;
      responses: Record<string, any>;
      examplePhrases: string[];
      customPhrases: string[];
      trustedPersons: any[];
    }
  ) => {
    if (!userId) return;
    
    try {
      setSaving(true);
      
      // 1. Vérifier la signature
      if (!signature) {
        toast({
          title: "Attention",
          description: "Veuillez signer le document avant de l'enregistrer",
          variant: "default"
        });
        setSaving(false);
        return;
      }
      
      // 2. Enregistrer la signature
      await saveSignature();
      
      // 3. Enregistrer la synthèse
      const { data: synthData, error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: userId,
          free_text: freeText || "",
        }, {
          onConflict: 'user_id'
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Synthèse sauvegardée",
        description: "Votre synthèse a été enregistrée avec succès"
      });
      
      // 4. Générer le PDF
      toast({
        title: "Génération en cours",
        description: "Votre document PDF est en cours de création..."
      });
      
      const pdfRecord = await generatePDF({
        ...data,
        freeText,
        signature,
        userId
      });
      
      if (pdfRecord) {
        toast({
          title: "PDF généré",
          description: "Votre document PDF a été généré et enregistré dans 'Mes Directives'"
        });
        
        // Rediriger vers la page des directives après un court délai
        setTimeout(() => {
          navigate("/mes-directives");
        }, 2000);
      }
      
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement ou la génération:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la synthèse ou de générer le PDF",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    signature,
    setSignature,
    handleSaveAndGeneratePDF
  };
};
