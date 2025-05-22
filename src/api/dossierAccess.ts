
import { toast } from "@/hooks/use-toast";
import { retryWithBackoff } from "@/utils/api/retryWithBackoff";

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
 * API call to get authenticated user's dossier
 */
export const getAuthUserDossier = async (
  userId: string, 
  bruteForceIdentifier?: string,
  documentPath?: string
) => {
  console.log(`Tentative de récupération du dossier pour l'utilisateur authentifié: ${userId} (${bruteForceIdentifier || 'accès complet'})`);
  console.log("Document path reçu dans getAuthUserDossier:", documentPath);
  
  try {
    // Préparation des données de la requête
    const requestBody: any = {
      isAuthUserRequest: true,
      userId,
      bruteForceIdentifier
    };
    
    // Si un document est fourni, l'inclure dans la requête
    if (documentPath) {
      requestBody.documentPath = documentPath;
      console.log("Document ajouté à la requête:", documentPath);
    }
    
    const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      console.error(`Erreur HTTP ${response.status} lors de la récupération du dossier`);
      throw new Error(`Erreur de serveur: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Réponse de récupération du dossier:", result);
    
    // Vérifier si le document URL est bien présent dans la réponse
    if (documentPath && (!result.dossier || !result.dossier.contenu || !result.dossier.contenu.document_url)) {
      console.log("Document path non trouvé dans la réponse, ajout manuel:", documentPath);
      if (!result.dossier) {
        result.dossier = { contenu: {} };
      } else if (!result.dossier.contenu) {
        result.dossier.contenu = {};
      }
      
      // Ajouter manuellement le document_url
      result.dossier.contenu.document_url = documentPath;
    }
    
    return result;
  } catch (error) {
    console.error("Erreur dans getAuthUserDossier:", error);
    throw error;
  }
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
      toast({
        variant: "destructive",
        title: "Erreur d'accès",
        description: errorMessage
      });
      return { success: false, error: errorMessage };
    }
    
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
    const errorMessage = "Impossible de contacter le serveur après plusieurs tentatives. Veuillez vérifier votre connexion internet et réessayer.";
    toast({
      variant: "destructive",
      title: "Erreur de connexion",
      description: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};

/**
 * Gets authenticated user dossier with retries
 */
export const getAuthUserDossierWithRetries = async (
  userId: string, 
  bruteForceIdentifier?: string,
  documentPath?: string
) => {
  if (!userId) {
    return { success: false, error: "Utilisateur non authentifié" };
  }
  
  try {
    console.log("Appel getAuthUserDossierWithRetries avec document:", documentPath);
    
    const result = await retryWithBackoff(
      () => getAuthUserDossier(userId, bruteForceIdentifier, documentPath),
      3
    );
    
    if (!result.success) {
      const errorMessage = result.error || "Erreur de récupération du dossier";
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
      toast({
        variant: "destructive",
        title: "Erreur d'accès",
        description: errorMessage
      });
      return { success: false, error: errorMessage };
    }
    
    // Vérification supplémentaire du contenu du dossier
    if (!result.dossier.contenu) {
      console.warn("Le dossier récupéré ne contient pas de données");
      toast({
        variant: "default",
        title: "Attention",
        description: "Le dossier a été trouvé mais semble être vide. Certaines informations pourraient ne pas s'afficher correctement."
      });
    }
    
    // Vérifier si le document est présent quand c'était demandé
    if (documentPath && (!result.dossier.contenu.document_url || result.dossier.contenu.document_url !== documentPath)) {
      console.log("Ajout manuel du document demandé:", documentPath);
      result.dossier.contenu.document_url = documentPath;
      result.dossier.contenu.document_name = documentPath.split('/').pop() || "document";
    }
    
    console.log("Dossier final retourné:", result.dossier);
    return result;
  } catch (err: any) {
    console.error("Erreur dans getAuthUserDossierWithRetries:", err);
    const errorMessage = "Impossible de contacter le serveur après plusieurs tentatives. Veuillez vérifier votre connexion internet et réessayer.";
    toast({
      variant: "destructive",
      title: "Erreur de connexion",
      description: errorMessage
    });
    return { success: false, error: errorMessage };
  }
};
