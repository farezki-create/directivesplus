
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
}

interface PalliativeCareAccessState {
  loading: boolean;
  error: string | null;
  accessGranted: boolean;
  patientData: Patient | null;
}

interface PatientAccessResult {
  patient_id: string;
  access_granted: boolean;
  patient_info: {
    id: string;
    name: string;
    date_of_birth: string;
  };
}

export const usePalliativeCareAccess = () => {
  const [state, setState] = useState<PalliativeCareAccessState>({
    loading: false,
    error: null,
    accessGranted: false,
    patientData: null
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

  const verifyAccess = useCallback(async (
    lastName: string,
    firstName: string,
    birthDate: string,
    accessCode: string
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .rpc('verify_patient_access_with_code', {
          p_last_name: lastName,
          p_first_name: firstName,
          p_birth_date: birthDate,
          p_access_code: accessCode
        });

      if (error) {
        throw new Error(error.message);
      }

      const result = data?.[0] as PatientAccessResult;
      if (!result || !result.access_granted) {
        setState(prev => ({
          ...prev,
          error: "Accès refusé. Vérifiez les informations saisies.",
          accessGranted: false,
          patientData: null
        }));
        return null;
      }

      setState(prev => ({
        ...prev,
        accessGranted: true,
        patientData: {
          id: result.patient_info.id,
          name: result.patient_info.name,
          date_of_birth: result.patient_info.date_of_birth
        }
      }));

      return result.patient_info;
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de la vérification";
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        accessGranted: false,
        patientData: null
      }));
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return {
    ...state,
    generateAccessCode,
    verifyAccess
  };
};
