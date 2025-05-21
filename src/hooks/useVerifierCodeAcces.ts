
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Dossier } from "@/store/dossierStore";

/**
 * Hook pour vérifier les codes d'accès et récupérer les dossiers
 */
export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Vérifie un code d'accès et récupère le dossier correspondant
   * @param code Code d'accès saisi par l'utilisateur 
   * @param bruteForceIdentifier Identifiant de contexte pour la vérification
   * @returns Dossier si la vérification est réussie, null sinon
   */
  const verifierCode = async (code: string, bruteForceIdentifier?: string) => {
    if (!code || code.trim() === '') {
      const errorMessage = "Veuillez saisir un code d'accès valide";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Code manquant",
        description: errorMessage
      });
      return { success: false, error: errorMessage };
    }

    setError(null);
    setLoading(true);
    
    try {
      console.log(`Tentative de vérification du code: ${code} avec identifiant: ${bruteForceIdentifier || 'aucun'}`);
      
      const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code_saisi: code,
          bruteForceIdentifier
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur HTTP ${response.status}:`, errorText);
        throw new Error(`Erreur de serveur: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        const errorMessage = result.error || "Code d'accès invalide";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: errorMessage
        });
        return { success: false, error: errorMessage };
      }
      
      // Vérifier que le résultat contient bien un dossier
      if (!result.dossier) {
        const errorMessage = "Le serveur n'a pas retourné de dossier";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: errorMessage
        });
        return { success: false, error: errorMessage };
      }
      
      console.log("Vérification réussie, dossier récupéré:", result.dossier?.id);
      return result;
    } catch (err: any) {
      console.error("Erreur lors de la vérification du code d'accès:", err);
      const errorMessage = "Impossible de contacter le serveur. Veuillez vérifier votre connexion internet et réessayer.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère le dossier de l'utilisateur authentifié
   * @param userId ID de l'utilisateur authentifié
   * @param bruteForceIdentifier Identifiant pour le contexte spécifique (directives ou médical)
   * @returns Le dossier de l'utilisateur ou null
   */
  const getDossierUtilisateurAuthentifie = async (userId: string, bruteForceIdentifier?: string) => {
    if (!userId) {
      setError("Utilisateur non authentifié");
      return { success: false, error: "Utilisateur non authentifié" };
    }
    
    setError(null);
    setLoading(true);
    
    try {
      console.log(`Récupération du dossier pour l'utilisateur authentifié: ${userId} (${bruteForceIdentifier || 'accès complet'})`);
      
      const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isAuthUserRequest: true,
          userId,
          bruteForceIdentifier
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur de serveur: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        const errorMessage = result.error || "Erreur de récupération du dossier";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: errorMessage
        });
        return { success: false, error: errorMessage };
      }
      
      // Vérifier que le résultat contient bien un dossier
      if (!result.dossier) {
        const errorMessage = "Le serveur n'a pas retourné de dossier";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: errorMessage
        });
        return { success: false, error: errorMessage };
      }
      
      console.log("Dossier utilisateur authentifié récupéré avec succès:", result.dossier?.id);
      return result;
    } catch (err: any) {
      console.error("Erreur lors de la récupération du dossier de l'utilisateur:", err);
      const errorMessage = "Impossible de contacter le serveur. Veuillez vérifier votre connexion internet et réessayer.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    verifierCode,
    getDossierUtilisateurAuthentifie,
    loading,
    error
  };
};
