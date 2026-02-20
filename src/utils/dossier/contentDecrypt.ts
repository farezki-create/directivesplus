
import { decryptData } from "@/utils/encryption";

/**
 * Decrypts dossier content if encrypted
 * @param content The content to decrypt
 * @returns Decrypted content or original content if not encrypted
 */
export const decryptDossierContent = (content: string | any): any => {
  try {
    if (typeof content === 'string' && content.startsWith('U2F')) {
      return decryptData(content);
    } else {
      return content;
    }
  } catch (error) {
    console.error("Erreur de déchiffrement:", error);
    throw new Error("Impossible de déchiffrer les données du dossier");
  }
};
