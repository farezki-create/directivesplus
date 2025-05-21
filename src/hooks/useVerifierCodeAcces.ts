
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

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
    setError(null);
    setLoading(true);
    
    try {
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
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        const errorMessage = result.error || "Code d'accès invalide";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: errorMessage
        });
        return null;
      }
      
      return result.dossier;
    } catch (err) {
      console.error("Erreur lors de la vérification du code d'accès:", err);
      setError("Une erreur est survenue lors de la vérification du code");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de contacter le serveur. Veuillez vérifier votre connexion internet et réessayer."
      });
      return null;
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
      return null;
    }
    
    setError(null);
    setLoading(true);
    
    try {
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
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        const errorMessage = result.error || "Erreur de récupération du dossier";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: errorMessage
        });
        return null;
      }
      
      return result.dossier;
    } catch (err) {
      console.error("Erreur lors de la récupération du dossier de l'utilisateur:", err);
      setError("Une erreur est survenue lors de la récupération de vos données");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de contacter le serveur. Veuillez vérifier votre connexion internet et réessayer."
      });
      return null;
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
