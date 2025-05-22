
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook spécialisé pour la vérification de codes d'accès médicaux partagés
 */
export const useAccessCodeVerification = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Vérifie un code d'accès partagé pour un document médical
   * @param sharedCode Code d'accès partagé
   * @returns Le document médical si la vérification est réussie, null sinon
   */
  const verifySharedAccessCode = async (sharedCode: string) => {
    if (!sharedCode || sharedCode.trim() === '') {
      const errorMessage = "Code d'accès partagé invalide ou manquant";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Code invalide",
        description: errorMessage
      });
      return { success: false, error: errorMessage, document: null };
    }

    setError(null);
    setLoading(true);
    
    try {
      console.log(`Vérification du code d'accès partagé: ${sharedCode}`);
      
      // Explicitly cast the result to any to avoid TypeScript inference issues
      const result: any = await supabase
        .from('medical_documents')
        .select('*')
        .eq('shared_code', sharedCode)
        .single();
      
      const data = result.data;
      const fetchError = result.error;
      
      if (fetchError) {
        console.error("Erreur lors de la récupération du document:", fetchError);
        setError(fetchError.message);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: "Document non trouvé ou code d'accès invalide"
        });
        return { success: false, error: fetchError.message, document: null };
      }
      
      if (!data) {
        const errorMessage = "Document non trouvé avec ce code d'accès";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: errorMessage
        });
        return { success: false, error: errorMessage, document: null };
      }
      
      console.log("Document trouvé avec succès:", data.id);
      
      // Enregistrer l'accès dans les logs
      await supabase.from('document_access_logs').insert({
        user_id: data.user_id,
        access_code_id: null,
        nom_consultant: null,
        prenom_consultant: null,
        ip_address: null,
        user_agent: navigator.userAgent
      });
      
      return { success: true, document: data };
    } catch (err: any) {
      console.error("Erreur lors de la vérification du code d'accès partagé:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erreur d'accès",
        description: "Une erreur est survenue lors de la vérification du code d'accès"
      });
      return { success: false, error: err.message, document: null };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    verifySharedAccessCode,
    loading,
    error
  };
};
