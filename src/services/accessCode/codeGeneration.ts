
import CryptoJS from 'crypto-js';

/**
 * Service for generating access codes
 */
export class CodeGenerationService {
  /**
   * Génère un code fixe reproductible basé sur l'ID utilisateur
   */
  static generateFixedCode(userId: string): string {
    console.log("🔑 Génération code fixe pour userId:", userId);
    
    // Créer un hash SHA256 de l'ID utilisateur
    const hash = CryptoJS.SHA256(`fixed-${userId}`).toString();
    
    // Prendre les 8 premiers caractères et les convertir en majuscules
    let code = hash.substring(0, 8).toUpperCase();
    
    // Remplacer certains caractères pour éviter la confusion
    code = code
      .replace(/0/g, 'O')
      .replace(/1/g, 'I')
      .replace(/5/g, 'S');
    
    console.log("🔑 Code fixe généré:", code);
    return code;
  }

  /**
   * Génère un code temporaire unique
   */
  static generateTemporaryCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
