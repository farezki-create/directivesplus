
import { toast } from "@/hooks/use-toast";
import { retryWithBackoff, showErrorToast } from "../utils/apiUtils";

/**
 * API call to get authenticated user's dossier
 */
export const getAuthUserDossier = async (
  userId: string, 
  bruteForceIdentifier?: string,
  documentPath?: string,
  documentsList?: any[]
) => {
  console.log(`Tentative de récupération du dossier pour l'utilisateur authentifié: ${userId} (${bruteForceIdentifier || 'accès complet'})`);
  console.log("Document path:", documentPath);
  console.log("Documents list:", documentsList);
  
  try {
    const requestBody: any = {
      isAuthUserRequest: true,
      userId,
      bruteForceIdentifier
    };
    
    // If a document path is provided, include it in the request
    if (documentPath) {
      requestBody.documentPath = documentPath;
      console.log("Adding document to dossier request:", documentPath);
    }
    
    // If a documents list is provided, include it in the request
    if (documentsList && documentsList.length > 0) {
      requestBody.documentsList = documentsList;
      console.log("Adding documents list to dossier request:", documentsList);
    }
    
    const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur HTTP ${response.status}:`, errorText);
      throw new Error(`Erreur de serveur: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Ensure document URL is present in the result if it was provided
    if (documentPath && result.success && result.dossier && !result.dossier.contenu.document_url) {
      console.log("Ajout manuel de l'URL du document au dossier:", documentPath);
      result.dossier.contenu.document_url = documentPath;
    }
    
    // Ensure documents list is present in the result if it was provided
    if (documentsList && documentsList.length > 0 && result.success && result.dossier && !result.dossier.contenu.documents) {
      console.log("Ajout manuel de la liste de documents au dossier:", documentsList);
      result.dossier.contenu.documents = documentsList;
    }
    
    console.log("Réponse de récupération du dossier utilisateur:", result);
    
    return result;
  } catch (err: any) {
    console.error("Erreur lors de la récupération du dossier authentifié:", err);
    return {
      success: false,
      error: err.message || "Erreur lors de l'accès au dossier"
    };
  }
};

/**
 * Gets authenticated user dossier with retries
 */
export const getAuthUserDossierWithRetries = async (
  userId: string, 
  bruteForceIdentifier?: string,
  documentPath?: string,
  documentsList?: any[]
) => {
  if (!userId) {
    return { success: false, error: "Utilisateur non authentifié" };
  }
  
  try {
    const result = await retryWithBackoff(
      () => getAuthUserDossier(userId, bruteForceIdentifier, documentPath, documentsList),
      3
    );
    
    if (!result.success) {
      const errorMessage = result.error || "Erreur de récupération du dossier";
      showErrorToast("Erreur d'accès", errorMessage);
      return { success: false, error: errorMessage };
    }
    
    // Vérifier que le résultat contient bien un dossier
    if (!result.dossier) {
      const errorMessage = "Le serveur n'a pas retourné de dossier";
      showErrorToast("Erreur d'accès", errorMessage);
      return { success: false, error: errorMessage };
    }
    
    // Vérifier si le document est présent quand c'était demandé
    if (documentPath && !result.dossier.contenu.document_url) {
      console.warn("Le document demandé n'a pas été ajouté au dossier:", documentPath);
      // Ajouter l'URL du document manuellement si elle n'a pas été incluse dans la réponse
      result.dossier.contenu.document_url = documentPath;
      console.log("URL du document ajoutée manuellement au dossier");
    }
    
    // Vérifier si la liste de documents est présente quand c'était demandé
    if (documentsList && documentsList.length > 0 && !result.dossier.contenu.documents) {
      console.warn("La liste de documents demandée n'a pas été ajoutée au dossier:", documentsList);
      // Ajouter la liste de documents manuellement si elle n'a pas été incluse dans la réponse
      result.dossier.contenu.documents = documentsList;
      console.log("Liste de documents ajoutée manuellement au dossier");
    }
    
    console.log("Dossier authentifié récupéré avec succès:", result.dossier);
    
    return result;
  } catch (err: any) {
    const errorMessage = "Impossible de contacter le serveur après plusieurs tentatives. Veuillez vérifier votre connexion internet et réessayer.";
    showErrorToast("Erreur de connexion", errorMessage);
    return { success: false, error: errorMessage };
  }
};
