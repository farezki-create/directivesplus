
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Hook pour la génération et la gestion des codes d'accès partagés
 */
export const useSharedCodeGeneration = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Génère un nouveau code d'accès partagé pour un document médical
   * @param documentId ID du document médical
   * @param expiresInDays Nombre de jours avant expiration (optionnel)
   * @returns Le code d'accès généré
   */
  const generateSharedCode = async (documentId: string, expiresInDays?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Génération d'un code d'accès pour le document: ${documentId}`);
      
      // Vérifier si le document existe et appartient à l'utilisateur
      const { data: document, error: docError } = await supabase
        .from('medical_documents')
        .select('id, owner_id')
        .eq('id', documentId)
        .single();
      
      if (docError || !document) {
        throw new Error("Document non trouvé ou accès refusé");
      }
      
      // Vérifier que l'utilisateur est bien le propriétaire du document
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || document.owner_id !== user.id) {
        throw new Error("Vous n'êtes pas autorisé à partager ce document");
      }
      
      // Générer un code aléatoire
      const sharedCode = uuidv4().substring(0, 8).toUpperCase();
      
      // Calculer la date d'expiration si nécessaire
      let expiresAt = null;
      if (expiresInDays) {
        const date = new Date();
        date.setDate(date.getDate() + expiresInDays);
        expiresAt = date.toISOString();
      }
      
      // Mettre à jour le document avec le nouveau code
      const { error: updateError } = await supabase
        .from('medical_documents')
        .update({
          shared_code: sharedCode,
          shared_expires_at: expiresAt
        })
        .eq('id', documentId);
      
      if (updateError) {
        throw new Error("Erreur lors de la mise à jour du document");
      }
      
      toast({
        variant: "default",
        title: "Code généré",
        description: "Le code d'accès a été généré avec succès"
      });
      
      return { success: true, sharedCode, expiresAt };
    } catch (err: any) {
      console.error("Erreur lors de la génération du code d'accès:", err);
      setError(err.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Erreur lors de la génération du code d'accès"
      });
      
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Révoque un code d'accès partagé
   * @param documentId ID du document médical
   * @returns Statut de l'opération
   */
  const revokeSharedCode = async (documentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Révocation du code d'accès pour le document: ${documentId}`);
      
      // Vérifier si le document existe et appartient à l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Mettre à jour le document pour supprimer le code d'accès
      const { error: updateError } = await supabase
        .from('medical_documents')
        .update({
          shared_code: null,
          shared_expires_at: null
        })
        .eq('id', documentId)
        .eq('owner_id', user.id);
      
      if (updateError) {
        throw new Error("Erreur lors de la révocation du code d'accès");
      }
      
      toast({
        variant: "default",
        title: "Code révoqué",
        description: "Le code d'accès a été révoqué avec succès"
      });
      
      return { success: true };
    } catch (err: any) {
      console.error("Erreur lors de la révocation du code d'accès:", err);
      setError(err.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Erreur lors de la révocation du code d'accès"
      });
      
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    generateSharedCode,
    revokeSharedCode,
    loading,
    error
  };
};
