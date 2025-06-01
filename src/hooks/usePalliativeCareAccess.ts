
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PalliativeCareAccessState {
  loading: boolean;
  error: string | null;
}

export const usePalliativeCareAccess = () => {
  const [state, setState] = useState<PalliativeCareAccessState>({
    loading: false,
    error: null
  });

  const generateAccessCode = useCallback(async (patientId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Générer un nouveau code d'accès
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_patient_access_code');

      if (codeError) {
        throw new Error(codeError.message);
      }

      // Mettre à jour le patient avec le nouveau code
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours
      const { error: updateError } = await supabase
        .from('patients')
        .update({
          access_code: codeData,
          access_code_expires_at: expiresAt.toISOString()
        })
        .eq('id', patientId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      toast({
        title: "Code généré",
        description: "Le code d'accès pour le suivi palliatif a été généré avec succès"
      });

      return codeData;
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de la génération du code";
      setState(prev => ({ ...prev, error: errorMessage }));
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return {
    ...state,
    generateAccessCode
  };
};
