
import CryptoJS from 'crypto-js';

// Clé de chiffrement - dans un système réel, elle devrait être stockée de manière sécurisée
// et idéalement différente pour chaque dossier
const SECRET_KEY = "DirectivesPlus_SecureKey_2025";

/**
 * Chiffre des données avec AES
 * @param data Les données à chiffrer (objet ou chaîne)
 * @returns Les données chiffrées sous forme de chaîne
 */
export const encryptData = (data: any): string => {
  // Convertir les objets en JSON string si nécessaire
  const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
  
  // Chiffrer avec AES
  return CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
};

/**
 * Déchiffre des données chiffrées avec AES
 * @param encryptedData Les données chiffrées
 * @param asObject Si true, tente de parser le résultat en JSON
 * @returns Les données déchiffrées
 */
export const decryptData = (encryptedData: string, asObject: boolean = true): any => {
  try {
    // Déchiffrer avec AES
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    // Tenter de parser en JSON si demandé
    if (asObject) {
      try {
        return JSON.parse(decryptedString);
      } catch (e) {
        console.warn("Les données déchiffrées ne sont pas un JSON valide, retour de la chaîne");
        return decryptedString;
      }
    }
    
    return decryptedString;
  } catch (error) {
    console.error("Erreur lors du déchiffrement:", error);
    return null;
  }
};
