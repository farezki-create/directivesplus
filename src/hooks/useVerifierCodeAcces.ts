
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Dossier } from "@/store/dossierStore";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook pour vérifier les codes d'accès et récupérer les dossiers
 */
export const useVerifierCodeAcces = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Vérifie un code d'accès et récupère le dossier correspondant avec tentatives de reconnexion
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
    setRetryCount(0);
    
    // Exponential backoff pour les tentatives de reconnexion
    const retryWithBackoff = async (currentRetry = 0): Promise<any> => {
      try {
        console.log(`Tentative de vérification du code ${currentRetry + 1}/${MAX_RETRIES + 1}: ${code} avec identifiant: ${bruteForceIdentifier || 'aucun'}`);
        
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
          
          if (currentRetry < MAX_RETRIES) {
            setRetryCount(currentRetry + 1);
            const backoffTime = Math.min(Math.pow(2, currentRetry) * 1000, 10000);
            console.log(`Nouvelle tentative dans ${backoffTime}ms...`);
            await wait(backoffTime);
            return retryWithBackoff(currentRetry + 1);
          }
          
          throw new Error(`Erreur de serveur: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("Réponse de vérification du code:", result);
        
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
        
        // Vérification supplémentaire du contenu du dossier
        if (!result.dossier.contenu) {
          console.warn("Le dossier récupéré ne contient pas de données");
          toast({
            variant: "default",
            title: "Attention",
            description: "Le dossier a été trouvé mais semble être vide. Certaines informations pourraient ne pas s'afficher correctement."
          });
        }
        
        return result;
      } catch (err: any) {
        console.error("Erreur lors de la vérification du code d'accès:", err);
        
        // Si nous n'avons pas dépassé le nombre maximum de tentatives, réessayons
        if (currentRetry < MAX_RETRIES) {
          setRetryCount(currentRetry + 1);
          const backoffTime = Math.min(Math.pow(2, currentRetry) * 1000, 10000);
          console.log(`Nouvelle tentative dans ${backoffTime}ms...`);
          await wait(backoffTime);
          return retryWithBackoff(currentRetry + 1);
        }
        
        const errorMessage = "Impossible de contacter le serveur après plusieurs tentatives. Veuillez vérifier votre connexion internet et réessayer.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage
        });
        return { success: false, error: errorMessage };
      }
    };

    try {
      const result = await retryWithBackoff();
      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère le dossier de l'utilisateur authentifié avec tentatives de reconnexion
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
    setRetryCount(0);
    
    // Exponential backoff pour les tentatives de reconnexion
    const retryWithBackoff = async (currentRetry = 0): Promise<any> => {
      try {
        console.log(`Tentative ${currentRetry + 1}/${MAX_RETRIES + 1} de récupération du dossier pour l'utilisateur authentifié: ${userId} (${bruteForceIdentifier || 'accès complet'})`);
        
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
          if (currentRetry < MAX_RETRIES) {
            setRetryCount(currentRetry + 1);
            const backoffTime = Math.min(Math.pow(2, currentRetry) * 1000, 10000);
            console.log(`Nouvelle tentative dans ${backoffTime}ms...`);
            await wait(backoffTime);
            return retryWithBackoff(currentRetry + 1);
          }
          throw new Error(`Erreur de serveur: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("Réponse de récupération du dossier utilisateur:", result);
        
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
        
        // Vérification supplémentaire du contenu du dossier
        if (!result.dossier.contenu) {
          console.warn("Le dossier récupéré ne contient pas de données");
          toast({
            variant: "default",
            title: "Attention",
            description: "Le dossier a été trouvé mais semble être vide. Certaines informations pourraient ne pas s'afficher correctement."
          });
        }
        
        return result;
      } catch (err: any) {
        console.error("Erreur lors de la récupération du dossier de l'utilisateur:", err);
        
        // Si nous n'avons pas dépassé le nombre maximum de tentatives, réessayons
        if (currentRetry < MAX_RETRIES) {
          setRetryCount(currentRetry + 1);
          const backoffTime = Math.min(Math.pow(2, currentRetry) * 1000, 10000);
          console.log(`Nouvelle tentative dans ${backoffTime}ms...`);
          await wait(backoffTime);
          return retryWithBackoff(currentRetry + 1);
        }
        
        const errorMessage = "Impossible de contacter le serveur après plusieurs tentatives. Veuillez vérifier votre connexion internet et réessayer.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage
        });
        return { success: false, error: errorMessage };
      }
    };

    try {
      const result = await retryWithBackoff();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifierCode,
    getDossierUtilisateurAuthentifie,
    loading,
    error,
    retryCount
  };
};
