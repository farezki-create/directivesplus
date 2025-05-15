
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";
import { useSignature } from "@/hooks/useSignature";

export const useSynthesisActions = (userId?: string) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { signature, setSignature, saveSignature } = useSignature(userId);

  const handleSaveSynthesis = async (freeText: string) => {
    if (!userId) return;
    
    try {
      setSaving(true);
      
      // 1. Enregistrer la signature d'abord
      if (!signature) {
        toast({
          title: "Attention",
          description: "Veuillez signer le document avant de l'enregistrer",
          variant: "default"
        });
        setSaving(false);
        return;
      }
      
      await saveSignature();
      
      // 2. Enregistrer ou mettre à jour l'enregistrement de synthèse
      const { data, error } = await supabase
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
      
      console.log("Synthèse enregistrée:", data);
      
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la synthèse:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la synthèse",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async (data: {
    profileData: any;
    responses: Record<string, any>;
    examplePhrases: string[];
    customPhrases: string[];
    trustedPersons: any[];
    freeText: string;
  }) => {
    try {
      setGenerating(true);
      
      if (!signature) {
        toast({
          title: "Signature requise",
          description: "Veuillez signer le document avant de générer le PDF",
          variant: "destructive"
        });
        setGenerating(false);
        return;
      }
      
      // Appeler la fonction de génération de PDF
      const pdfRecord = await generatePDF({
        ...data,
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
      console.error("Erreur lors de la génération du PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  return {
    saving,
    generating,
    signature,
    setSignature,
    handleSaveSynthesis,
    handleGeneratePDF
  };
};
