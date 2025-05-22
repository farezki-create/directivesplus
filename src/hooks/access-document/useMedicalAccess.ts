
import { toast } from "@/hooks/use-toast";

export interface MedicalAccessResult {
  success: boolean;
  error?: string;
  data?: any;
}

export const useMedicalAccess = () => {
  const accessMedicalData = async (formData: any): Promise<MedicalAccessResult> => {
    console.log("This function has been removed. Access to medical data now requires login.");
    
    toast({
      title: "Connexion requise",
      description: "Vous devez vous connecter pour accéder à cette fonctionnalité",
      variant: "destructive"
    });
    
    return { success: false, error: "Connexion requise" };
  };
  
  return {
    loading: false,
    accessMedicalData
  };
};
