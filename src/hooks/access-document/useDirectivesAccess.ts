
import { toast } from "@/hooks/use-toast";

export const accessDirectives = async (formData: any) => {
  console.log("This function has been removed. Access to directives now requires login.");
  
  toast({
    title: "Connexion requise",
    description: "Vous devez vous connecter pour accéder à cette fonctionnalité",
    variant: "destructive"
  });
  
  return { success: false, error: "Connexion requise" };
};
