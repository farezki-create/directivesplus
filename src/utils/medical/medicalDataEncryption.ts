
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const medicalDataEncryption = {
  async storeMedicalData(userId: string, data: any): Promise<string | null> {
    try {
      const accessCode = generateSecureAccessCode();
      
      const { data: result, error } = await supabase
        .from('medical_data')
        .insert([
          { 
            user_id: userId, 
            data: JSON.stringify(data), 
            access_code: accessCode 
          }
        ])
        .select('id')
        .single();
        
      if (error) throw error;
      
      return accessCode;
    } catch (error) {
      console.error("Failed to store medical data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données médicales",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async verifyAccess(medicalDataId: string, name: string, birthdate: string, accessCode: string) {
    try {
      const { data, error } = await supabase.rpc(
        'verify_medical_data_access',
        {
          p_medical_data_id: medicalDataId,
          p_name: name,
          p_birthdate: birthdate,
          p_access_code: accessCode
        }
      );
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Medical data access verification failed:", error);
      return null;
    }
  }
};

function generateSecureAccessCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'MD-'; // Medical Data prefix
  
  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}
