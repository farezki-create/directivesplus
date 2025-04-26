
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { medicalDataEncryption } from "@/utils/medical/medicalDataEncryption";

export interface MedicalData {
  id: string;
  data: any;
  created_at: string;
  updated_at: string;
  access_code?: string;
}

export function useMedicalData(userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [medicalData, setMedicalData] = useState<MedicalData[]>([]);
  const { toast } = useToast();

  const fetchMedicalData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setMedicalData(data || []);
    } catch (error) {
      console.error("Error fetching medical data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos données médicales",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveMedicalData = async (data: any): Promise<string | null> => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder vos données médicales",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      const accessCode = await medicalDataEncryption.storeMedicalData(userId, data);
      
      if (accessCode) {
        toast({
          title: "Succès",
          description: "Vos données médicales ont été sauvegardées",
        });
        await fetchMedicalData();
        return accessCode;
      }
      return null;
    } catch (error) {
      console.error("Error saving medical data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos données médicales",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAccess = async (
    medicalDataId: string, 
    name: string, 
    birthdate: string, 
    accessCode: string
  ) => {
    try {
      const result = await medicalDataEncryption.verifyAccess(
        medicalDataId,
        name,
        birthdate,
        accessCode
      );
      
      if (!result || !result[0]?.is_valid) {
        throw new Error("Accès refusé");
      }
      
      return result[0].medical_data_content;
    } catch (error) {
      console.error("Access verification failed:", error);
      toast({
        title: "Erreur d'accès",
        description: "Les informations fournies ne permettent pas d'accéder à ces données",
        variant: "destructive"
      });
      return null;
    }
  };
  
  return {
    medicalData,
    isLoading,
    fetchMedicalData,
    saveMedicalData,
    verifyAccess
  };
}
