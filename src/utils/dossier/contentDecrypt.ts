
import { decryptData } from "@/utils/encryption";

/**
 * Decrypts dossier content if encrypted
 * @param content The content to decrypt
 * @returns Decrypted content or original content if not encrypted
 */
export const decryptDossierContent = (content: string | any): any => {
  try {
    // Check if the content is encrypted (base64 encoded)
    if (typeof content === 'string' && content.startsWith('U2F')) {
      const decrypted = decryptData(content);
      console.log("Données déchiffrées avec succès");
      return decrypted;
    } else {
      // If data is not encrypted (backwards compatibility)
      console.log("Données non chiffrées utilisées directement");
      return content;
    }
  } catch (error) {
    console.error("Erreur de déchiffrement:", error);
    throw new Error("Impossible de déchiffrer les données du dossier");
  }
};
