
import CryptoJS from 'crypto-js';

/**
 * Service pour la génération de codes d'accès
 */
export class CodeGenerationService {
  /**
   * Génère un code fixe basé sur l'ID utilisateur
   * Le même utilisateur aura toujours le même code
   */
  static generateFixedCode(userId: string): string {
    // Utiliser le hash SHA-256 de l'ID utilisateur pour générer un code reproductible
    const hash = CryptoJS.SHA256(userId).toString();
    
    // Prendre les 8 premiers caractères et les convertir en format code
    let code = hash.substring(0, 8).toUpperCase();
    
    // Remplacer certains caractères pour éviter la confusion
    code = code
      .replace(/0/g, 'O')  // Zéro -> O
      .replace(/1/g, 'I')  // Un -> I  
      .replace(/5/g, 'S'); // Cinq -> S
    
    return code;
  }

  /**
   * Génère un code temporaire aléatoire
   */
  static generateTemporaryCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Valide le format d'un code d'accès
   */
  static isValidCodeFormat(code: string): boolean {
    // Code doit faire 8 caractères, lettres majuscules et chiffres uniquement
    return /^[A-Z0-9]{8}$/.test(code);
  }
}
