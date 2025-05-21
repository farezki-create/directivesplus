
import CryptoJS from 'crypto-js';

// Système de clés avec rotation - permet de faire évoluer les clés tout en maintenant la rétrocompatibilité
interface EncryptionKey {
  id: string;
  key: string;
  active: boolean; // Indique s'il s'agit de la clé active pour le chiffrement
  validFrom: Date;
  validUntil?: Date;
}

// Configuration des clés de chiffrement
// Dans un système réel, cette configuration devrait être stockée de manière sécurisée 
// et idéalement récupérée depuis un service de gestion des secrets
const ENCRYPTION_KEYS: EncryptionKey[] = [
  {
    id: 'key-2025-v1',
    key: "DirectivesPlus_SecureKey_2025",
    active: true,
    validFrom: new Date('2025-01-01'),
  },
  {
    id: 'key-2024-v1',
    key: "DirectivesPlus_SecureKey_2024",
    active: false,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31')
  }
];

// Récupère la clé active pour le chiffrement
const getActiveKey = (): EncryptionKey => {
  const activeKey = ENCRYPTION_KEYS.find(k => k.active);
  
  if (!activeKey) {
    throw new Error("Aucune clé de chiffrement active trouvée");
  }
  
  return activeKey;
};

// Format des données chiffrées avec métadonnées
interface EncryptedDataWithMetadata {
  keyId: string;  // Identifiant de la clé utilisée
  data: string;   // Données chiffrées
  version: number; // Version du format de chiffrement
  timestamp: number; // Timestamp du chiffrement
}

/**
 * Chiffre des données avec AES en incluant des métadonnées sur la clé utilisée
 * @param data Les données à chiffrer (objet ou chaîne)
 * @returns Les données chiffrées avec métadonnées
 */
export const encryptData = (data: any): string => {
  // Convertir les objets en JSON string si nécessaire
  const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
  
  // Récupérer la clé active
  const activeKey = getActiveKey();
  
  // Chiffrer avec AES
  const encryptedData = CryptoJS.AES.encrypt(dataString, activeKey.key).toString();
  
  // Créer l'objet avec métadonnées
  const encryptedWithMetadata: EncryptedDataWithMetadata = {
    keyId: activeKey.id,
    data: encryptedData,
    version: 1,
    timestamp: Date.now()
  };
  
  // Retourner sous forme de chaîne JSON
  return JSON.stringify(encryptedWithMetadata);
};

/**
 * Déchiffre des données chiffrées avec AES en prenant en compte les métadonnées de rotation des clés
 * @param encryptedDataString Les données chiffrées avec métadonnées
 * @param asObject Si true, tente de parser le résultat en JSON
 * @returns Les données déchiffrées
 */
export const decryptData = (encryptedDataString: string, asObject: boolean = true): any => {
  try {
    // Tenter de parser les données comme format avec métadonnées
    let encryptedWithMetadata: EncryptedDataWithMetadata;
    let encryptedData: string;
    let keyToUse: string;
    
    try {
      // Format avec métadonnées (nouveau format)
      encryptedWithMetadata = JSON.parse(encryptedDataString);
      encryptedData = encryptedWithMetadata.data;
      
      // Récupérer la clé correspondante
      const key = ENCRYPTION_KEYS.find(k => k.id === encryptedWithMetadata.keyId);
      
      if (!key) {
        throw new Error(`Clé de chiffrement avec ID ${encryptedWithMetadata.keyId} non trouvée`);
      }
      
      keyToUse = key.key;
    } catch (parseError) {
      // Ancien format sans métadonnées - utiliser la clé legacy par défaut
      encryptedData = encryptedDataString;
      keyToUse = "DirectivesPlus_SecureKey_2025"; // Clé legacy
    }
    
    // Déchiffrer avec AES
    const bytes = CryptoJS.AES.decrypt(encryptedData, keyToUse);
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

/**
 * Fonction pour réchiffrer des données avec la clé active actuelle
 * Utile lors de la rotation des clés pour mettre à jour les données existantes
 * @param encryptedDataString Les données chiffrées à mettre à jour
 * @returns Les données rechiffrées avec la clé active
 */
export const reencryptWithActiveKey = (encryptedDataString: string): string => {
  // Déchiffrer d'abord avec l'ancienne clé
  const decryptedData = decryptData(encryptedDataString, false);
  
  if (decryptedData === null) {
    throw new Error("Impossible de déchiffrer les données pour les rechiffrer");
  }
  
  // Rechiffrer avec la clé active
  return encryptData(decryptedData);
};
