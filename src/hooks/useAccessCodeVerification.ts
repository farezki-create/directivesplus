
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Définition explicite du type pour le document médical
type MedicalDocument = {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  description: string;
  created_at: string;
  shared_code?: string;
  shared_code_expires_at?: string;
  is_active?: boolean;
};

// Type de retour simplifié pour les fonctions
type VerificationResult = {
  success: boolean;
  error?: string;
  document?: MedicalDocument | null;
};

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
  const verifySharedAccessCode = async (sharedCode: string): Promise<VerificationResult> => {
    if (!sharedCode || sharedCode.trim() === '') {
      const errorMessage = "Code d'accès partagé invalide ou manquant";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Code invalide",
        description: errorMessage
      });
      return { success: false, error: errorMessage };
    }

    setError(null);
    setLoading(true);
    
    try {
      console.log(`Vérification du code d'accès partagé: ${sharedCode}`);
      
      // Utilisation d'une approche simplifiée pour éviter les problèmes de typage
      const { data, error: fetchError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('shared_code', sharedCode) as { data: any, error: any };
      
      // Traitement sécurisé des données après récupération
      let document: MedicalDocument | null = null;
      if (data && Array.isArray(data) && data.length > 0) {
        // Cast explicite vers MedicalDocument
        document = data[0] as MedicalDocument;
      }
      
      if (fetchError) {
        console.error("Erreur lors de la récupération du document:", fetchError);
        setError(fetchError.message);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: "Document non trouvé ou code d'accès invalide"
        });
        return { success: false, error: fetchError.message };
      }
      
      if (!document) {
        const errorMessage = "Document non trouvé avec ce code d'accès";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: errorMessage
        });
        return { success: false, error: errorMessage };
      }
      
      console.log("Document trouvé avec succès:", document.id);
      
      // Enregistrer l'accès dans les logs
      await supabase.from('document_access_logs').insert({
        user_id: document.user_id,
        access_code_id: null,
        nom_consultant: null,
        prenom_consultant: null,
        ip_address: null,
        user_agent: navigator.userAgent
      });
      
      return { success: true, document };
    } catch (err: any) {
      console.error("Erreur lors de la vérification du code d'accès partagé:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erreur d'accès",
        description: "Une erreur est survenue lors de la vérification du code d'accès"
      });
      return { success: false, error: err.message };
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
