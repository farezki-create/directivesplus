import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useHealthcareAuth() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const registerHealthcareProfessional = async (professionalData: {
    id: string;
    rpps_number: string;
    professional_type: "doctor" | "nurse" | "pharmacist" | "other";
    first_name: string;
    last_name: string;
    specialty: string | null;
    cps_number: string;
  }) => {
    try {
      setLoading(true);
      console.log("[HealthcareAuth] Registering healthcare professional:", professionalData);

      // Format the data to match the database schema
      const formattedData = {
        id: professionalData.id,
        rpps_number: professionalData.rpps_number,
        professional_type: professionalData.professional_type,
        first_name: professionalData.first_name,
        last_name: professionalData.last_name,
        specialty: professionalData.specialty,
        cps_number: professionalData.cps_number,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("healthcare_professionals")
        .upsert(formattedData);

      if (error) {
        console.error("[HealthcareAuth] Error registering healthcare professional:", error);
        throw error;
      }

      console.log("[HealthcareAuth] Healthcare professional registered successfully");
      toast({
        title: "Succès",
        description: "Votre compte professionnel de santé a été créé avec succès.",
      });

      return true;
    } catch (error) {
      console.error("[HealthcareAuth] Error in registration process:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre compte.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    registerHealthcareProfessional,
  };
}