
import { toast } from "@/hooks/use-toast";
import { retryWithBackoff, showErrorToast } from "../utils/apiUtils";

/**
 * API call to verify a code d'accès
 */
export const verifyAccessCode = async (
  code: string, 
  bruteForceIdentifier?: string
) => {
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
  console.log("Réponse de vérification du code:", result);
  
  return result;
};

/**
 * Verifies access code with retries
 */
export const verifyCodeWithRetries = async (code: string, bruteForceIdentifier?: string) => {
  try {
    const result = await retryWithBackoff(
      () => verifyAccessCode(code, bruteForceIdentifier),
      3
    );
    
    if (!result.success) {
      const errorMessage = result.error || "Code d'accès invalide";
      showErrorToast("Erreur d'accès", errorMessage);
      return { success: false, error: errorMessage };
    }
    
    // Vérifier que le résultat contient bien un dossier
    if (!result.dossier) {
      const errorMessage = "Le serveur n'a pas retourné de dossier";
      showErrorToast("Erreur d'accès", errorMessage);
      return { success: false, error: errorMessage };
    }
    
    console.log("Dossier récupéré avec succès:", result.dossier);
    
    return result;
  } catch (err: any) {
    const errorMessage = "Impossible de contacter le serveur après plusieurs tentatives. Veuillez vérifier votre connexion internet et réessayer.";
    showErrorToast("Erreur de connexion", errorMessage);
    return { success: false, error: errorMessage };
  }
};
